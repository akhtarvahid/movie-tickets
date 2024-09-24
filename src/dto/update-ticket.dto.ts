import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateTicketDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content: string;
}

export default UpdateTicketDto;
