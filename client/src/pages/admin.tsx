import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "../hooks/use-language";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { Product, GalleryImage, Order, insertProductSchema, insertGalleryImageSchema } from "@shared/schema";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Settings, Package, Images, ShoppingCart, Plus, Edit, Trash2, Eye, FileText, Download, Truck, MapPin } from "lucide-react";

const categories = ["Obstacle", "Dressage", "Cross", "Mixte", "Poney"];
const sizes = ["16", "16.5", "17", "17.5", "18", "18.5"];

type ProductFormData = z.infer<typeof insertProductSchema>;
type GalleryFormData = z.infer<typeof insertGalleryImageSchema>;

export default function Admin() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = useState(false);

  // Queries
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: galleryImages, isLoading: galleryLoading } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  // Shipping management
  const generateLabelMutation = useMutation({
    mutationFn: ({ orderId, shippingData }: { orderId: number; shippingData: any }) =>
      apiRequest("POST", "/api/shipping/generate-label", { orderId, shippingData }),
    onSuccess: async (response) => {
      const data = await response.json();
      toast({
        title: "Étiquette générée",
        description: `Étiquette DPD générée: ${data.trackingNumber}`,
      });
      // Ouvrir automatiquement l'étiquette dans un nouvel onglet
      window.open(data.labelUrl, '_blank');
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de générer l'étiquette DPD",
        variant: "destructive",
      });
    },
  });

  const trackPackageMutation = useMutation({
    mutationFn: (trackingNumber: string) =>
      apiRequest("GET", `/api/shipping/track/${trackingNumber}`),
    onSuccess: async (response) => {
      const data = await response.json();
      toast({
        title: "Suivi du colis",
        description: `Statut: ${data.status} - ${data.location}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de suivre le colis",
        variant: "destructive",
      });
    },
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: (data: ProductFormData) => apiRequest("POST", "/api/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: t("admin.productCreated") });
      setShowProductDialog(false);
    },
    onError: (error) => {
      toast({ title: t("admin.error"), description: error.message, variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductFormData> }) =>
      apiRequest("PUT", `/api/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Produit modifié avec succès" });
      setEditingProduct(null);
      setShowProductDialog(false);
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Produit supprimé avec succès" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const createGalleryImageMutation = useMutation({
    mutationFn: (data: GalleryFormData) => apiRequest("POST", "/api/gallery", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Image ajoutée avec succès" });
      setShowGalleryDialog(false);
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const deleteGalleryImageMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/gallery/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Image supprimée avec succès" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  // Forms
  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      category: "Obstacle",
      size: "17",
      price: "0",
      description: "",
      image: "",
      images: [],
      featured: false,
      inStock: true,
    },
  });

  const galleryForm = useForm<GalleryFormData>({
    resolver: zodResolver(insertGalleryImageSchema),
    defaultValues: {
      url: "",
      alt: "",
      category: "Obstacle",
    },
  });

  const handleProductSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleGallerySubmit = (data: GalleryFormData) => {
    createGalleryImageMutation.mutate(data);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    productForm.reset({
      name: product.name,
      category: product.category,
      size: product.size,
      price: product.price,
      originalPrice: product.originalPrice || undefined,
      description: product.description,
      image: product.image,
      images: product.images || [],
      featured: product.featured || false,
      inStock: product.inStock || true,
    });
    setShowProductDialog(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    productForm.reset();
    setShowProductDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="h-8 w-8" />
            {t("admin.title")}
          </h1>
          <p className="text-gray-600 mt-2">
            Interface d'administration pour gérer les produits, la galerie et les commandes.
          </p>
        </div>

        <Tabs defaultValue="products" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t("admin.products")}
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Images className="h-4 w-4" />
              {t("admin.gallery")}
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              {t("admin.orders")}
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Gestion des produits</h2>
              <Button onClick={handleNewProduct} className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau produit
              </Button>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-300 h-6 rounded mb-2"></div>
                    <div className="bg-gray-300 h-4 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                  <Card key={product.id}>
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      {product.featured && (
                        <Badge className="absolute top-2 right-2 bg-accent">
                          Vedette
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.category} - {product.size}</p>
                      <p className="text-lg font-bold text-primary mb-4">
                        {parseFloat(product.price).toFixed(2)} €
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProductMutation.mutate(product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Gestion de la galerie</h2>
              <Button onClick={() => setShowGalleryDialog(true)} className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle image
              </Button>
            </div>

            {galleryLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-300 aspect-square rounded-lg mb-2"></div>
                    <div className="bg-gray-300 h-4 rounded mb-1"></div>
                    <div className="bg-gray-300 h-3 rounded w-20"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {galleryImages?.map((image) => (
                  <Card key={image.id}>
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-black bg-opacity-70 text-white">
                          {image.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-sm font-medium mb-1">{image.alt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{image.category}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteGalleryImageMutation.mutate(image.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-semibold">Gestion des commandes</h2>

            {ordersLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-300 h-24 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : orders?.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="h-24 w-24 mx-auto mb-6 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">Aucune commande</h3>
                <p className="text-gray-600">Les commandes apparaîtront ici une fois effectuées.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders?.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            Commande #{order.id}
                          </h3>
                          <p className="text-gray-600">
                            {order.customerName} - {order.customerEmail}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={order.status === 'paid' ? 'default' : 'secondary'}
                          >
                            {order.status}
                          </Badge>
                          <p className="text-lg font-bold text-primary mt-1">
                            {parseFloat(order.totalAmount).toFixed(2)} €
                          </p>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Adresse de livraison</h4>
                          <p className="text-sm text-gray-600">
                            {order.customerAddress}<br />
                            {order.customerCity}, {order.customerPostalCode}<br />
                            {order.customerCountry}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Date de commande</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt!).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* DPD Shipping Actions */}
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Actions de livraison DPD</h4>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateLabelMutation.mutate({ 
                              orderId: order.id, 
                              shippingData: {
                                customerName: order.customerName,
                                customerAddress: order.customerAddress,
                                customerCity: order.customerCity,
                                customerPostalCode: order.customerPostalCode,
                                customerCountry: order.customerCountry,
                                weight: 4.0,
                                value: parseFloat(order.totalAmount)
                              }
                            })}
                            disabled={generateLabelMutation.isPending}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {generateLabelMutation.isPending ? 'Génération...' : 'Générer étiquette'}
                          </Button>
                          
                          {order.stripeSessionId && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => trackPackageMutation.mutate(order.stripeSessionId)}
                              disabled={trackPackageMutation.isPending}
                            >
                              <Truck className="h-4 w-4 mr-2" />
                              {trackPackageMutation.isPending ? 'Suivi...' : 'Suivre colis'}
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://www.dpd.fr/suivi_colis`, '_blank')}
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Ouvrir DPD
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Product Dialog */}
        <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? t("admin.editProduct") : t("admin.newProduct")}
              </DialogTitle>
              <DialogDescription>
                {editingProduct ? t("admin.editProductDesc") : t("admin.newProductDesc")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={productForm.handleSubmit(handleProductSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom *</Label>
                  <Input
                    id="name"
                    {...productForm.register("name")}
                    placeholder="Nom du produit"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={productForm.watch("category")}
                    onValueChange={(value) => productForm.setValue("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="size">Taille *</Label>
                  <Select
                    value={productForm.watch("size")}
                    onValueChange={(value) => productForm.setValue("size", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Taille" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Prix *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...productForm.register("price")}
                    placeholder="Prix"
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Prix original</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    {...productForm.register("originalPrice")}
                    placeholder="Prix original"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...productForm.register("description")}
                  placeholder="Description du produit"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="image">URL de l'image principale *</Label>
                <Input
                  id="image"
                  {...productForm.register("image")}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={productForm.watch("featured")}
                    onCheckedChange={(checked) => productForm.setValue("featured", checked as boolean)}
                  />
                  <Label htmlFor="featured">Produit vedette</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={productForm.watch("inStock")}
                    onCheckedChange={(checked) => productForm.setValue("inStock", checked as boolean)}
                  />
                  <Label htmlFor="inStock">En stock</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowProductDialog(false)}>
                  {t("admin.cancel")}
                </Button>
                <Button type="submit" className="btn-primary">
                  {editingProduct ? t("admin.modify") : t("admin.create")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Gallery Dialog */}
        <Dialog open={showGalleryDialog} onOpenChange={setShowGalleryDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("admin.newImage")}</DialogTitle>
              <DialogDescription>
                {t("admin.newImageDesc")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={galleryForm.handleSubmit(handleGallerySubmit)} className="space-y-4">
              <div>
                <Label htmlFor="url">URL de l'image *</Label>
                <Input
                  id="url"
                  {...galleryForm.register("url")}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="alt">Texte alternatif *</Label>
                <Input
                  id="alt"
                  {...galleryForm.register("alt")}
                  placeholder="Description de l'image"
                />
              </div>

              <div>
                <Label htmlFor="galleryCategory">Catégorie *</Label>
                <Select
                  value={galleryForm.watch("category")}
                  onValueChange={(value) => galleryForm.setValue("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowGalleryDialog(false)}>
                  {t("admin.cancel")}
                </Button>
                <Button type="submit" className="btn-primary">
                  {t("admin.add")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
