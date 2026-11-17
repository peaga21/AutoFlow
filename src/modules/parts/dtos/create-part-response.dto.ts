export interface CreatePartResponseDto {
  id: string;
  code: string;
  name: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  createdAt: Date;
}
