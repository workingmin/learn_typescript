import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum DatabaseInstanceStatus {
  OK = 0,
  Invalid = 1,
}

@Entity()
export class DatabaseInstance {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Database id.',
    type: String,
  })
  id: String;

  @ApiProperty({
    description:
      'The hostname of your Redis database, for example redis.acme.com.',
    type: String,
  })
  @Column({ nullable: false })
  host: string;

  @ApiProperty({
    description: 'The port your Redis database is available on.',
    type: Number,
  })
  @Column({ nullable: false })
  port: number;

  @ApiProperty({
    description: 'A name for Redis database.',
    type: String,
  })
  @Column({ nullable: false })
  name: string;

  @ApiPropertyOptional({
    description: 'The username, if your database is ACL enabled.',
    type: String,
  })
  @Column({ nullable: true })
  username: string;

  @ApiPropertyOptional({
    description: 'The password for your Redis database.',
    type: String,
  })
  @Column({ nullable: true })
  password: string;

  @ApiPropertyOptional({
    description: 'Database status',
    type: Number,
  })
  @Column({ nullable: false })
  status: number;
}
