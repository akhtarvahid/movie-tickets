import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({
    example: 'movie_name',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      "description of the movie",
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export default CreateTicketDto;
