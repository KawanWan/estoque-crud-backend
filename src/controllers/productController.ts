import { Request, Response } from 'express';
import prisma from '../config/prisma';

// Tipos para os dados de entrada
interface ProductBody {
  name: string;
  description?: string;
  value: number;
  quantity: number;
  image?: string;
}

interface UpdateProductBody {
  name?: string;
  description?: string;
  value?: number;
  quantity?: number;
  image?: string;
}

// Buscar todos os produtos
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
};

// Adicionar um novo produto
export const addProduct = async (
  req: Request<{}, {}, ProductBody>,
  res: Response
): Promise<void> => {
  const { name, description, value, quantity, image } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        value: Number(value),
        quantity: Number(quantity),
        image,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar produto.' });
  }
};

// Atualizar um produto existente
export const updateProduct = async (
  req: Request<{ id: string }, {}, UpdateProductBody>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, description, value, quantity, image } = req.body;

  try {
    // Verifica se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProduct) {
      res.status(404).json({ error: 'Produto não encontrado.' });
      return;
    }

    // Atualiza o produto
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: name || existingProduct.name,
        description: description || existingProduct.description,
        value: value ? Number(value) : existingProduct.value,
        quantity: quantity ? Number(quantity) : existingProduct.quantity,
        image: image || existingProduct.image,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o produto.' });
  }
};

// Excluir um produto
export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    // Verifica se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProduct) {
      res.status(404).json({ error: 'Produto não encontrado.' });
      return;
    }

    // Exclui o produto
    await prisma.product.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Produto excluído com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir o produto.' });
  }
};