'use client';

import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Search,
  AlertCircle,
  Upload,
  X,
  Edit2,
  Image as ImageIcon,
  Package,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { formatCurrency } from '@/lib/utils';

// -- Zod Schema --

const productSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descricao deve ter pelo menos 10 caracteres'),
  category: z.string().min(1, 'Categoria obrigatoria'),
  brand: z.string().min(1, 'Marca obrigatoria'),
  unit: z.string().min(1, 'Unidade obrigatoria'),
  price: z.number({ required_error: 'Preco obrigatorio' }).min(0.01, 'Preco deve ser maior que zero'),
  tariffCode: z
    .string()
    .regex(/^\d{8}$/, 'NCM deve ter exatamente 8 digitos numericos')
    .or(z.literal('')),
  sku: z.string().min(1, 'SKU obrigatorio'),
  stockQuantity: z.number().min(0, 'Estoque nao pode ser negativo'),
});

type ProductFormData = z.infer<typeof productSchema>;

// -- Types --

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  unit: string;
  price: number;
  tariffCode: string;
  sku: string;
  stockQuantity: number;
  imageUrl: string | null;
  regions: string[];
  active: boolean;
}

// -- Brazilian states --

const brazilianStates = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN',
  'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
];

// -- Mock data --

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Fertilizante NPK 20-05-20',
    description: 'Fertilizante mineral misto NPK formulacao 20-05-20 para culturas anuais',
    category: 'Fertilizantes',
    brand: 'NutriAgro',
    unit: 'ton',
    price: 285000,
    tariffCode: '31052000',
    sku: 'FERT-NPK-2020',
    stockQuantity: 500,
    imageUrl: null,
    regions: ['SP', 'MG', 'MT', 'MS', 'GO', 'PR'],
    active: true,
  },
  {
    id: '2',
    name: 'Semente Soja TMG 2381',
    description: 'Semente de soja certificada variedade TMG 2381 tratada com fungicida e inseticida',
    category: 'Sementes',
    brand: 'TMG',
    unit: 'sc',
    price: 49000,
    tariffCode: '12011000',
    sku: 'SEM-SOJ-2381',
    stockQuantity: 2000,
    imageUrl: null,
    regions: ['MT', 'MS', 'GO', 'MG', 'BA'],
    active: true,
  },
  {
    id: '3',
    name: 'Herbicida Glifosato 480g/L',
    description: 'Herbicida nao seletivo a base de glifosato concentrado soluvel 480g/L',
    category: 'Defensivos',
    brand: 'AgroChem',
    unit: 'L',
    price: 4200,
    tariffCode: '',
    sku: 'DEF-GLI-480',
    stockQuantity: 10000,
    imageUrl: null,
    regions: ['SP', 'MG', 'PR', 'RS'],
    active: true,
  },
  {
    id: '4',
    name: 'Calcario Dolomitico PRNT 85%',
    description: 'Calcario dolomitico com PRNT 85% para correcao de acidez do solo',
    category: 'Corretivos',
    brand: 'MineralCal',
    unit: 'ton',
    price: 19200,
    tariffCode: '25210000',
    sku: 'COR-CAL-85',
    stockQuantity: 800,
    imageUrl: null,
    regions: ['MG', 'SP', 'GO', 'MT'],
    active: true,
  },
  {
    id: '5',
    name: 'Adubo Organico Composto',
    description: 'Adubo organico composto classe A para uso em diversas culturas',
    category: 'Fertilizantes',
    brand: 'BioFert',
    unit: 'ton',
    price: 12000,
    tariffCode: '',
    sku: 'FERT-ORG-001',
    stockQuantity: 300,
    imageUrl: null,
    regions: ['SP', 'MG'],
    active: true,
  },
  {
    id: '6',
    name: 'Fungicida Azoxistrobina + Ciproconazol',
    description: 'Fungicida sistemico de amplo espectro para controle de doencas em soja e milho',
    category: 'Defensivos',
    brand: 'FungiPro',
    unit: 'L',
    price: 26000,
    tariffCode: '',
    sku: 'DEF-AZO-CIP',
    stockQuantity: 5000,
    imageUrl: null,
    regions: ['MT', 'MS', 'GO', 'MG', 'PR', 'SP', 'BA'],
    active: true,
  },
];

const categoryOptions = [
  { value: 'Fertilizantes', label: 'Fertilizantes' },
  { value: 'Sementes', label: 'Sementes' },
  { value: 'Defensivos', label: 'Defensivos' },
  { value: 'Corretivos', label: 'Corretivos' },
  { value: 'Inoculantes', label: 'Inoculantes' },
  { value: 'Outros', label: 'Outros' },
];

const unitOptions = [
  { value: 'ton', label: 'Tonelada (ton)' },
  { value: 'kg', label: 'Quilograma (kg)' },
  { value: 'sc', label: 'Saca (sc)' },
  { value: 'L', label: 'Litro (L)' },
  { value: 'un', label: 'Unidade (un)' },
];

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [regionDialogOpen, setRegionDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const filteredProducts = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (categoryFilter && p.category !== categoryFilter) return false;
    return true;
  });

  const productsWithoutTariff = products.filter((p) => !p.tariffCode);

  function openProductDialog(product?: Product) {
    if (product) {
      setEditingProduct(product);
      reset({
        name: product.name,
        description: product.description,
        category: product.category,
        brand: product.brand,
        unit: product.unit,
        price: product.price / 100,
        tariffCode: product.tariffCode,
        sku: product.sku,
        stockQuantity: product.stockQuantity,
      });
      setImagePreview(product.imageUrl);
    } else {
      setEditingProduct(null);
      reset({
        name: '',
        description: '',
        category: '',
        brand: '',
        unit: '',
        price: 0,
        tariffCode: '',
        sku: '',
        stockQuantity: 0,
      });
      setImagePreview(null);
    }
    setDialogOpen(true);
  }

  function openRegionDialog(product: Product) {
    setEditingProduct(product);
    setSelectedRegions([...product.regions]);
    setRegionDialogOpen(true);
  }

  function toggleRegion(state: string) {
    setSelectedRegions((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
    );
  }

  function saveRegions() {
    if (!editingProduct) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingProduct.id ? { ...p, regions: selectedRegions } : p
      )
    );
    setRegionDialogOpen(false);
    setEditingProduct(null);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function onSubmitProduct(data: ProductFormData) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...data,
                price: Math.round(data.price * 100),
                imageUrl: imagePreview,
              }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        id: String(Date.now()),
        ...data,
        price: Math.round(data.price * 100),
        imageUrl: imagePreview,
        regions: [],
        active: true,
      };
      setProducts((prev) => [...prev, newProduct]);
    }

    setSubmitting(false);
    setDialogOpen(false);
    setEditingProduct(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs />
          <h1 className="mt-2 text-2xl font-bold text-foreground">Catalogo</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus produtos, precos e disponibilidade por regiao
          </p>
        </div>
        <Button onClick={() => openProductDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Alert for products without tariffCode */}
      {productsWithoutTariff.length > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive-500/30 bg-destructive-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive-500" />
          <div>
            <p className="text-sm font-semibold text-destructive-700">
              {productsWithoutTariff.length} produto(s) sem codigo NCM
            </p>
            <p className="mt-0.5 text-xs text-destructive-600">
              Os seguintes produtos estao sem classificacao fiscal (NCM):{' '}
              {productsWithoutTariff.map((p) => p.name).join(', ')}.
              Isso pode impedir a emissao de nota fiscal.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome ou SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-10 w-full rounded-md border border-border bg-white pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
          />
        </div>
        <Select
          options={[{ value: '', label: 'Todas as Categorias' }, ...categoryOptions]}
          value={categoryFilter}
          onChange={setCategoryFilter}
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative h-40 bg-muted">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-border" />
                </div>
              )}
              {!product.tariffCode && (
                <Badge
                  variant="destructive"
                  className="absolute right-2 top-2"
                >
                  Sem NCM
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {product.brand} &middot; SKU: {product.sku}
                  </p>
                </div>
                <Badge variant="outline">{product.category}</Badge>
              </div>

              <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                {product.description}
              </p>

              <div className="mb-3 flex items-center justify-between">
                <span className="text-lg font-bold text-primary-600">
                  {formatCurrency(product.price / 100)}/{product.unit}
                </span>
                <span className="text-xs text-muted-foreground">
                  Estoque: {product.stockQuantity} {product.unit}
                </span>
              </div>

              {product.tariffCode && (
                <p className="mb-2 text-xs text-muted-foreground">
                  NCM: {product.tariffCode}
                </p>
              )}

              <div className="mb-3 flex flex-wrap gap-1">
                {product.regions.slice(0, 5).map((state) => (
                  <span
                    key={state}
                    className="rounded bg-primary-50 px-1.5 py-0.5 text-[10px] font-medium text-primary-600"
                  >
                    {state}
                  </span>
                ))}
                {product.regions.length > 5 && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    +{product.regions.length - 5}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => openProductDialog(product)}
                >
                  <Edit2 className="mr-1 h-3 w-3" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openRegionDialog(product)}
                >
                  Regioes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12">
            <Package className="h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Nenhum produto encontrado
            </p>
          </div>
        )}
      </div>

      {/* Product Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          onClose={() => setDialogOpen(false)}
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Atualize as informacoes do produto'
                : 'Preencha os dados para cadastrar um novo produto'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitProduct)}>
            <div className="my-4 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Imagem do Produto
                </label>
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border hover:border-primary-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setImagePreview(null)}
                    >
                      <X className="mr-1 h-3 w-3" />
                      Remover
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nome do Produto"
                  placeholder="Ex: Fertilizante NPK 20-05-20"
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Input
                  label="SKU"
                  placeholder="Ex: FERT-NPK-2020"
                  {...register('sku')}
                  error={errors.sku?.message}
                />
              </div>

              <Textarea
                label="Descricao"
                placeholder="Descreva o produto..."
                rows={3}
                {...register('description')}
                error={errors.description?.message}
              />

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Categoria"
                      options={categoryOptions}
                      placeholder="Selecione..."
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.category?.message}
                    />
                  )}
                />
                <Input
                  label="Marca"
                  placeholder="Ex: NutriAgro"
                  {...register('brand')}
                  error={errors.brand?.message}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Unidade"
                      options={unitOptions}
                      placeholder="Selecione..."
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.unit?.message}
                    />
                  )}
                />
                <Input
                  type="number"
                  step="0.01"
                  label="Preco (R$)"
                  placeholder="0.00"
                  {...register('price', { valueAsNumber: true })}
                  error={errors.price?.message}
                />
                <Input
                  type="number"
                  label="Estoque"
                  placeholder="0"
                  {...register('stockQuantity', { valueAsNumber: true })}
                  error={errors.stockQuantity?.message}
                />
              </div>

              <div>
                <Input
                  label="Codigo NCM (8 digitos)"
                  placeholder="Ex: 31052000"
                  maxLength={8}
                  {...register('tariffCode')}
                  error={errors.tariffCode?.message}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Nomenclatura Comum do Mercosul. 8 digitos numericos obrigatorios para emissao de NF-e.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={submitting}>
                {editingProduct ? 'Salvar Alteracoes' : 'Cadastrar Produto'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Region Configuration Dialog */}
      <Dialog open={regionDialogOpen} onOpenChange={setRegionDialogOpen}>
        <DialogContent onClose={() => setRegionDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Configurar Regioes</DialogTitle>
            <DialogDescription>
              Selecione os estados onde o produto{' '}
              <strong>{editingProduct?.name}</strong> esta disponivel
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <div className="flex flex-wrap gap-2">
              {brazilianStates.map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => toggleRegion(state)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    selectedRegions.includes(state)
                      ? 'bg-primary-500 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-border'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {selectedRegions.length} estado(s) selecionado(s)
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRegionDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={saveRegions}>Salvar Regioes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
