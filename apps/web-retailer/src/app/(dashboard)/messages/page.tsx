'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  MessageCircle, Search, Send, Paperclip, Phone, MoreVertical, Circle, Image,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { cn } from '@/lib/utils';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  isMine: boolean;
}

const CONTACTS: Contact[] = [
  { id: '1', name: 'Fazenda Santa Clara', avatar: 'FS', lastMessage: 'Certo, envio a cotação até amanhã.', time: '10:32', unread: 2, online: true },
  { id: '2', name: 'Agro Paulista', avatar: 'AP', lastMessage: 'Qual a quantidade mínima?', time: '09:15', unread: 0, online: true },
  { id: '3', name: 'Cooperativa Vale Verde', avatar: 'CV', lastMessage: 'Obrigado! Pedido confirmado.', time: 'Ontem', unread: 0, online: false },
  { id: '4', name: 'Sítio Três Irmãos', avatar: 'ST', lastMessage: 'Tem previsão de entrega?', time: 'Ontem', unread: 1, online: false },
  { id: '5', name: 'Granja Bela Vista', avatar: 'GB', lastMessage: 'Vocês trabalham com soja orgânica?', time: 'Seg', unread: 0, online: false },
];

const MESSAGES: Message[] = [
  { id: '1', senderId: '1', text: 'Olá! Tenho interesse em 20 toneladas de soja.', time: '10:15', isMine: false },
  { id: '2', senderId: 'me', text: 'Bom dia! Claro, posso preparar uma cotação. Qual a região de entrega?', time: '10:18', isMine: true },
  { id: '3', senderId: '1', text: 'Entrega em Ribeirão Preto, SP. Preciso até o final do mês.', time: '10:25', isMine: false },
  { id: '4', senderId: 'me', text: 'Perfeito. Vou verificar disponibilidade e preço atual.', time: '10:28', isMine: true },
  { id: '5', senderId: '1', text: 'Certo, envio a cotação até amanhã.', time: '10:32', isMine: false },
];

export default function MessagesPage() {
  const t = useTranslations('messages');
  const [selectedId, setSelectedId] = useState('1');
  const [search, setSearch] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredContacts = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedContact = CONTACTS.find(c => c.id === selectedId);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('title') }]} />

      <div>
        <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
        <p className="text-sm text-on-surface-variant mt-1">{t('subtitle')}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[340px_1fr] h-[calc(100vh-16rem)]">
        {/* Contact List */}
        <Card className="glass-card flex flex-col overflow-hidden">
          <div className="p-3 border-b border-outline-variant/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
              <Input
                placeholder={t('search') + '...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {filteredContacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => setSelectedId(contact.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 hover:bg-surface-variant/30 transition-colors text-left border-b border-outline-variant/10',
                  selectedId === contact.id && 'bg-primary/10 border-l-2 border-l-primary'
                )}
              >
                <div className="relative shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-sm">
                    {contact.avatar}
                  </div>
                  {contact.online && (
                    <Circle className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-on-surface truncate">{contact.name}</p>
                    <span className="text-xs text-on-surface-variant/60 shrink-0 ml-2">{contact.time}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                    {contact.unread}
                  </span>
                )}
              </button>
            ))}
            {filteredContacts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <MessageCircle className="h-10 w-10 text-on-surface-variant/40 mb-2" />
                <p className="text-sm text-on-surface-variant">{t('noConversations')}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="glass-card flex flex-col overflow-hidden">
          {/* Chat Header */}
          {selectedContact && (
            <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-sm">
                    {selectedContact.avatar}
                  </div>
                  {selectedContact.online && (
                    <Circle className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-on-surface">{selectedContact.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    {selectedContact.online ? t('online') : t('offline')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
            {MESSAGES.map(msg => (
              <div key={msg.id} className={cn('flex', msg.isMine ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[70%] rounded-2xl px-4 py-2.5',
                  msg.isMine
                    ? 'bg-primary text-on-primary rounded-br-md'
                    : 'bg-surface-variant/50 text-on-surface rounded-bl-md'
                )}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={cn('text-[10px] mt-1', msg.isMine ? 'text-on-primary/70' : 'text-on-surface-variant/60')}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-outline-variant/30">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 shrink-0">
                <Image className="h-4 w-4" />
              </Button>
              <Input
                placeholder={t('typeMessage') + '...'}
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                className="flex-1"
                onKeyDown={e => { if (e.key === 'Enter') setNewMessage(''); }}
              />
              <Button size="sm" className="h-9 w-9 p-0 shrink-0" disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
