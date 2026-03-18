import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Model } from 'mongoose';
import { Queue } from 'bullmq';
import {
  Notification,
  NotificationDocument,
  NotificationChannel,
  NotificationStatus,
  RecipientType,
} from './schemas/notification.schema';
import {
  NotificationPreference,
  NotificationPreferenceDocument,
} from './schemas/notification-preference.schema';
import { OneSignalAdapter } from './adapters/onesignal.adapter';
import { WhatsAppAdapter } from './adapters/whatsapp.adapter';
import { SesAdapter } from './adapters/ses.adapter';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

interface EventChannelMapping {
  channels: NotificationChannel[];
  title: string;
  bodyTemplate: string;
  screen?: string;
}

const EVENT_CHANNEL_MAP: Record<string, EventChannelMapping> = {
  'identity.kyc.approved': {
    channels: [NotificationChannel.PUSH, NotificationChannel.EMAIL],
    title: 'KYC Aprovado',
    bodyTemplate:
      'Seu cadastro foi aprovado com sucesso! Agora voce pode usar todos os recursos do iFarm.',
    screen: 'profile',
  },
  'identity.kyc.rejected': {
    channels: [NotificationChannel.PUSH, NotificationChannel.EMAIL],
    title: 'KYC Rejeitado',
    bodyTemplate:
      'Infelizmente seu cadastro foi rejeitado. Por favor, verifique os documentos enviados.',
    screen: 'kyc',
  },
  'quotation.quote.created': {
    channels: [NotificationChannel.PUSH],
    title: 'Nova Cotacao Disponivel',
    bodyTemplate:
      'Uma nova cotacao foi criada e esta aguardando suas propostas.',
    screen: 'quotations',
  },
  'quotation.proposal.received': {
    channels: [NotificationChannel.PUSH],
    title: 'Proposta Recebida',
    bodyTemplate:
      'Voce recebeu uma nova proposta para sua cotacao. Confira agora!',
    screen: 'proposals',
  },
  'quotation.proposal.accepted': {
    channels: [NotificationChannel.PUSH],
    title: 'Proposta Aceita',
    bodyTemplate: 'A proposta foi aceita! O pedido sera processado em breve.',
    screen: 'orders',
  },
  'payment.pix.pending': {
    channels: [NotificationChannel.PUSH],
    title: 'Pagamento PIX Pendente',
    bodyTemplate:
      'Seu pagamento PIX esta pendente. Escaneie o QR Code para concluir.',
    screen: 'payment',
  },
  'payment.confirmed': {
    channels: [NotificationChannel.PUSH, NotificationChannel.WHATSAPP],
    title: 'Pagamento Confirmado',
    bodyTemplate:
      'O pagamento foi confirmado com sucesso! Seu pedido sera preparado.',
    screen: 'orders',
  },
  'payment.failed': {
    channels: [NotificationChannel.PUSH],
    title: 'Pagamento Falhou',
    bodyTemplate:
      'O pagamento nao foi processado. Tente novamente ou use outro metodo.',
    screen: 'payment',
  },
  'order.dispatched': {
    channels: [NotificationChannel.PUSH],
    title: 'Pedido Enviado',
    bodyTemplate: 'Seu pedido foi despachado e esta a caminho!',
    screen: 'orders',
  },
  'order.delivered': {
    channels: [NotificationChannel.PUSH],
    title: 'Pedido Entregue',
    bodyTemplate: 'O pedido foi entregue com sucesso!',
    screen: 'orders',
  },
  'commission.released': {
    channels: [NotificationChannel.PUSH, NotificationChannel.EMAIL],
    title: 'Comissao Liberada',
    bodyTemplate: 'Sua comissao foi liberada e esta disponivel para saque.',
    screen: 'commissions',
  },
  'order.disputed': {
    channels: [NotificationChannel.PUSH],
    title: 'Disputa Aberta',
    bodyTemplate:
      'Uma disputa foi aberta para um pedido. Verifique os detalhes.',
    screen: 'disputes',
  },
};

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    @InjectModel(NotificationPreference.name)
    private readonly preferenceModel: Model<NotificationPreferenceDocument>,
    @InjectQueue('notification-send')
    private readonly sendQueue: Queue,
    private readonly oneSignalAdapter: OneSignalAdapter,
    private readonly whatsAppAdapter: WhatsAppAdapter,
    private readonly sesAdapter: SesAdapter,
  ) {}

  async routeNotification(
    eventType: string,
    payload: Record<string, any>,
  ): Promise<void> {
    const mapping = EVENT_CHANNEL_MAP[eventType];
    if (!mapping) {
      this.logger.warn(`No channel mapping found for event: ${eventType}`);
      return;
    }

    const recipientId = payload.recipientId || payload.farmerId || payload.retailerId;
    const recipientType = payload.recipientType || RecipientType.FARMER;

    if (!recipientId) {
      this.logger.warn(
        `No recipientId found in payload for event: ${eventType}`,
      );
      return;
    }

    const isQuietHours = await this.checkQuietHours(recipientId);

    for (const channel of mapping.channels) {
      const isEnabled = await this.checkPreferences(recipientId, channel);
      if (!isEnabled) {
        this.logger.log(
          `Channel ${channel} disabled for recipient ${recipientId}, skipping`,
        );
        continue;
      }

      if (isQuietHours && channel === NotificationChannel.PUSH) {
        this.logger.log(
          `Quiet hours active for recipient ${recipientId}, skipping push`,
        );
        continue;
      }

      const notification = new this.notificationModel({
        recipientId,
        recipientType,
        channel,
        eventType,
        title: mapping.title,
        body: payload.customBody || mapping.bodyTemplate,
        data: {
          screen: mapping.screen || null,
          entityId: payload.entityId || null,
          ...payload.data,
        },
        status: NotificationStatus.PENDING,
        attempts: 0,
        lastAttemptAt: null,
        failureReason: null,
        sentAt: null,
      });

      const saved = await notification.save();

      await this.sendQueue.add(
        'send-notification',
        {
          notificationId: saved._id.toString(),
          channel,
          recipientId,
          recipientType,
          title: mapping.title,
          body: payload.customBody || mapping.bodyTemplate,
          data: saved.data,
          email: payload.email,
          phoneNumber: payload.phoneNumber,
        },
        {
          attempts: 3,
          backoff: {
            type: 'custom',
          },
          removeOnComplete: 100,
          removeOnFail: false,
        },
      );

      this.logger.log(
        `Queued ${channel} notification ${saved._id} for ${recipientId}`,
      );
    }

    if (eventType === 'order.disputed' && payload.adminRecipientIds) {
      for (const adminId of payload.adminRecipientIds) {
        const adminNotification = new this.notificationModel({
          recipientId: adminId,
          recipientType: RecipientType.ADMIN,
          channel: NotificationChannel.PUSH,
          eventType,
          title: 'Alerta: Disputa Aberta',
          body: `Uma disputa foi aberta para o pedido ${payload.entityId || 'N/A'}. Acao necessaria.`,
          data: {
            screen: 'admin-disputes',
            entityId: payload.entityId || null,
          },
          status: NotificationStatus.PENDING,
          attempts: 0,
        });

        const savedAdmin = await adminNotification.save();

        await this.sendQueue.add(
          'send-notification',
          {
            notificationId: savedAdmin._id.toString(),
            channel: NotificationChannel.PUSH,
            recipientId: adminId,
            recipientType: RecipientType.ADMIN,
            title: adminNotification.title,
            body: adminNotification.body,
            data: adminNotification.data,
          },
          {
            attempts: 3,
            backoff: { type: 'custom' },
            removeOnComplete: 100,
            removeOnFail: false,
          },
        );
      }
    }
  }

  async sendPush(
    recipientId: string,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<void> {
    await this.oneSignalAdapter.sendPush({
      externalUserIds: [recipientId],
      title,
      body,
      data,
    });
  }

  async sendWhatsApp(
    phoneNumber: string,
    templateName: string,
    params: string[],
  ): Promise<void> {
    await this.whatsAppAdapter.sendTemplate({
      phoneNumber,
      templateName,
      parameters: params.map((text) => ({ type: 'text' as const, text })),
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
  ): Promise<void> {
    await this.sesAdapter.sendEmail({ to, subject, htmlBody });
  }

  async checkQuietHours(recipientId: string): Promise<boolean> {
    const preference = await this.preferenceModel
      .findOne({ externalAuthId: recipientId })
      .exec();

    if (!preference || !preference.quietHours) {
      return false;
    }

    const { start, end } = preference.quietHours;
    const tz = preference.timezone || 'America/Sao_Paulo';

    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const currentTime = formatter.format(now);

    const [currentH, currentM] = currentTime.split(':').map(Number);
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    const currentMinutes = currentH * 60 + currentM;
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (startMinutes > endMinutes) {
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }

    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }

  async checkPreferences(
    recipientId: string,
    channel: NotificationChannel,
  ): Promise<boolean> {
    const preference = await this.preferenceModel
      .findOne({ externalAuthId: recipientId })
      .exec();

    if (!preference) {
      return true;
    }

    switch (channel) {
      case NotificationChannel.PUSH:
        return preference.isPushEnabled;
      case NotificationChannel.WHATSAPP:
        return preference.isWhatsappEnabled;
      case NotificationChannel.EMAIL:
        return preference.isEmailEnabled;
      default:
        return true;
    }
  }

  async processNotificationSend(jobData: Record<string, any>): Promise<void> {
    const {
      notificationId,
      channel,
      recipientId,
      title,
      body,
      data,
      email,
      phoneNumber,
    } = jobData;

    const notification = await this.notificationModel
      .findById(notificationId)
      .exec();

    if (!notification) {
      this.logger.warn(`Notification ${notificationId} not found, skipping`);
      return;
    }

    notification.attempts += 1;
    notification.lastAttemptAt = new Date();

    try {
      switch (channel) {
        case NotificationChannel.PUSH:
          await this.sendPush(recipientId, title, body, data);
          break;
        case NotificationChannel.WHATSAPP:
          if (!phoneNumber) {
            throw new Error('Phone number is required for WhatsApp notifications');
          }
          await this.sendWhatsApp(phoneNumber, 'ifarm_notification', [
            title,
            body,
          ]);
          break;
        case NotificationChannel.EMAIL:
          if (!email) {
            throw new Error('Email is required for email notifications');
          }
          await this.sendEmail(
            email,
            title,
            `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
              <h2 style="color:#2d7a3a;">${title}</h2>
              <p>${body}</p>
              <hr/>
              <p style="font-size:12px;color:#888;">iFarm - Conectando o agronegocio</p>
            </div>`,
          );
          break;
      }

      notification.status = NotificationStatus.SENT;
      notification.sentAt = new Date();
      notification.failureReason = null;
    } catch (error: any) {
      const message = error.message || 'Unknown error';
      notification.failureReason = message;

      if (notification.attempts >= 3) {
        notification.status = NotificationStatus.FAILED;
        this.logger.error(
          `Notification ${notificationId} failed after 3 attempts: ${message}`,
        );
      }

      await notification.save();
      throw error;
    }

    await notification.save();
  }

  async getDlqNotifications(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    data: NotificationDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.notificationModel
        .find({ status: NotificationStatus.FAILED })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel
        .countDocuments({ status: NotificationStatus.FAILED })
        .exec(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPreferences(
    externalAuthId: string,
  ): Promise<NotificationPreferenceDocument> {
    let preference = await this.preferenceModel
      .findOne({ externalAuthId })
      .exec();

    if (!preference) {
      preference = await this.preferenceModel.create({
        externalAuthId,
        isPushEnabled: true,
        isWhatsappEnabled: true,
        isEmailEnabled: true,
        quietHours: { start: '22:00', end: '07:00' },
        timezone: 'America/Sao_Paulo',
      });
    }

    return preference;
  }

  async updatePreferences(
    externalAuthId: string,
    dto: UpdatePreferencesDto,
  ): Promise<NotificationPreferenceDocument> {
    const updateData: Record<string, any> = {};

    if (dto.isPushEnabled !== undefined) {
      updateData.isPushEnabled = dto.isPushEnabled;
    }
    if (dto.isWhatsappEnabled !== undefined) {
      updateData.isWhatsappEnabled = dto.isWhatsappEnabled;
    }
    if (dto.isEmailEnabled !== undefined) {
      updateData.isEmailEnabled = dto.isEmailEnabled;
    }
    if (dto.quietHours) {
      if (dto.quietHours.start) {
        updateData['quietHours.start'] = dto.quietHours.start;
      }
      if (dto.quietHours.end) {
        updateData['quietHours.end'] = dto.quietHours.end;
      }
    }
    if (dto.timezone) {
      updateData.timezone = dto.timezone;
    }

    const preference = await this.preferenceModel
      .findOneAndUpdate(
        { externalAuthId },
        { $set: updateData },
        { new: true, upsert: true },
      )
      .exec();

    if (!preference) {
      throw new NotFoundException('Preference not found');
    }

    return preference;
  }
}
