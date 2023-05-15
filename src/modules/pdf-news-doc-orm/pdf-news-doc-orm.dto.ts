import { IsEmail, IsNotEmpty } from 'class-validator';

export class NewspaperInfoDTO {
  @IsNotEmpty()
  name: string;
}
