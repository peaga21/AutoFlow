import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, Min } from 'class-validator';

export class CreatePartDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsNumber()
  @Min(0)
  stockQuantity!: number;

  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;
}
