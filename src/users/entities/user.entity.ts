import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
// import { Exclude } from 'class-transformer';

@Entity()
@Unique(['email'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email' })
  email: string;

  @Column()
  // @Exclude()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log(`Inserted user with id:${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated user with id:${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Deleted user with id:${this.id}`);
  }
}
