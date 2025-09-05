import React, { useState } from 'react';
import { UploadImageUniqueInput } from './upload-image-unique-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

/**
 * Exemplo de uso do UploadImageUniqueInput
 * 
 * Este exemplo demonstra como usar o componente em diferentes cenários:
 * 1. Formulário de criação de produto
 * 2. Formulário de edição de produto
 * 3. Upload de avatar de usuário
 */

interface Product {
  id: string;
  name: string;
  image?: string;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
}

export function UploadImageUniqueInputExample() {
  // Estado para simulação de produto
  const [product, setProduct] = useState<Product>({
    id: '1',
    name: 'Produto Exemplo',
    image: 'https://picsum.photos/300/300?random=1',
  });
  const [productFile, setProductFile] = useState<File | null>(null);
  const [productName, setProductName] = useState(product.name);

  // Estado para simulação de usuário
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'João Silva',
    avatar: 'https://picsum.photos/150/150?random=2',
  });
  const [userAvatarFile, setUserAvatarFile] = useState<File | null>(null);

  // Estado para novo produto
  const [newProductName, setNewProductName] = useState('');
  const [newProductFile, setNewProductFile] = useState<File | null>(null);

  // Simulação de salvar produto
  const handleSaveProduct = () => {
    const updatedProduct = {
      ...product,
      name: productName,
      // Em um app real, você enviaria o productFile para o servidor
      // e receberia a URL da imagem salva
    };
    console.log('Produto salvo:', updatedProduct);
    console.log('Arquivo de imagem:', productFile);
    alert('Produto salvo com sucesso!');
  };

  // Simulação de salvar usuário
  const handleSaveUser = () => {
    const updatedUser = {
      ...user,
      // Em um app real, você enviaria o userAvatarFile para o servidor
      // e receberia a URL do avatar salvo
    };
    console.log('Usuário salvo:', updatedUser);
    console.log('Arquivo de avatar:', userAvatarFile);
    alert('Avatar atualizado com sucesso!');
  };

  // Simulação de criar novo produto
  const handleCreateProduct = () => {
    if (!newProductName.trim()) {
      alert('Nome do produto é obrigatório');
      return;
    }
    
    const newProduct = {
      id: Date.now().toString(),
      name: newProductName,
      // Em um app real, você enviaria o newProductFile para o servidor
    };
    console.log('Novo produto criado:', newProduct);
    console.log('Arquivo de imagem:', newProductFile);
    alert('Produto criado com sucesso!');
    
    // Reset do formulário
    setNewProductName('');
    setNewProductFile(null);
  };

  // Simulação de reset para imagem original
  const handleResetProductImage = () => {
    setProduct(prev => ({ ...prev, image: 'https://picsum.photos/300/300?random=1' }));
    setProductFile(null);
  };

  const handleResetUserAvatar = () => {
    setUser(prev => ({ ...prev, avatar: 'https://picsum.photos/150/150?random=2' }));
    setUserAvatarFile(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">UploadImageUniqueInput - Exemplos</h1>
        <p className="text-muted-foreground">
          Demonstração dos diferentes cenários de uso do componente
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exemplo 1: Edição de Produto */}
        <Card>
          <CardHeader>
            <CardTitle>Editar Produto</CardTitle>
            <CardDescription>
              Exemplo de edição com imagem existente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="product-name">Nome do Produto</Label>
              <Input
                id="product-name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Nome do produto"
              />
            </div>
            
            <div>
              <Label>Imagem do Produto</Label>
              <UploadImageUniqueInput
                image={product.image}
                onChangeImage={(image) => setProduct(prev => ({ ...prev, image: image || undefined }))}
                file={productFile}
                onChangeFile={setProductFile}
                uploadButtonText="Alterar Imagem"
                alt="Imagem do produto"
                previewSize="lg"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveProduct} className="flex-1">
                Salvar Produto
              </Button>
              <Button onClick={handleResetProductImage} variant="outline">
                Reset Imagem
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Exemplo 2: Avatar de Usuário */}
        <Card>
          <CardHeader>
            <CardTitle>Avatar do Usuário</CardTitle>
            <CardDescription>
              Exemplo de upload de avatar com preview pequeno
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <Label>Avatar</Label>
                <UploadImageUniqueInput
                  image={user.avatar}
                  onChangeImage={(avatar) => setUser(prev => ({ ...prev, avatar: avatar || undefined }))}
                  file={userAvatarFile}
                  onChangeFile={setUserAvatarFile}
                  uploadButtonText="Alterar Avatar"
                  alt="Avatar do usuário"
                  previewSize="sm"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {userAvatarFile ? 'Novo avatar selecionado' : 'Avatar atual'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveUser} className="flex-1">
                Salvar Avatar
              </Button>
              <Button onClick={handleResetUserAvatar} variant="outline">
                Reset Avatar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Exemplo 3: Criação de Novo Produto */}
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Produto</CardTitle>
            <CardDescription>
              Exemplo de criação sem imagem inicial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="new-product-name">Nome do Produto</Label>
              <Input
                id="new-product-name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="Nome do novo produto"
              />
            </div>
            
            <div>
              <Label>Imagem do Produto</Label>
              <UploadImageUniqueInput
                file={newProductFile}
                onChangeFile={setNewProductFile}
                uploadButtonText="Carregar Imagem"
                alt="Nova imagem do produto"
                previewSize="md"
              />
            </div>

            <Button onClick={handleCreateProduct} className="w-full">
              Criar Produto
            </Button>
          </CardContent>
        </Card>

        {/* Exemplo 4: Upload Especializado */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Especializado</CardTitle>
            <CardDescription>
              Exemplo com restrições de tipo de arquivo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Apenas JPEG</Label>
              <UploadImageUniqueInput
                file={null}
                onChangeFile={() => {}}
                accept="image/jpeg"
                uploadButtonText="Apenas JPEG"
                alt="Imagem JPEG"
                previewSize="md"
              />
            </div>
            
            <div>
              <Label>Componente Desabilitado</Label>
              <UploadImageUniqueInput
                image="https://picsum.photos/200/200?random=3"
                disabled
                uploadButtonText="Upload Desabilitado"
                alt="Imagem desabilitada"
                previewSize="md"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Info</CardTitle>
          <CardDescription>
            Estado atual dos componentes (apenas para demonstração)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Produto</h4>
              <p>Nome: {productName}</p>
              <p>Imagem URL: {product.image || 'null'}</p>
              <p>Arquivo: {productFile ? productFile.name : 'null'}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Usuário</h4>
              <p>Nome: {user.name}</p>
              <p>Avatar URL: {user.avatar || 'null'}</p>
              <p>Arquivo: {userAvatarFile ? userAvatarFile.name : 'null'}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Novo Produto</h4>
              <p>Nome: {newProductName || 'null'}</p>
              <p>Arquivo: {newProductFile ? newProductFile.name : 'null'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 