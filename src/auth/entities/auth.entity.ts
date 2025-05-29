import { Entity, PrimaryColumn, Generated, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../../common/constants/roles.constant';

/**
 * Auth entity representing a user in the system
 */
@Entity('auths')
export class Auth {
  /**
   * Unique identifier for the user
   * Using UUID format for better security and global uniqueness
   */
  @PrimaryColumn('char', { length: 36 })
  @Generated('uuid')
  id: string;

  /**
   * Unique username for authentication
   */
  @Column({ unique: true })
  username: string;

  /**
   * Hashed password for authentication
   * @exclude This field is excluded from serialization
   */
  @Column({ nullable: false })
  @Exclude()
  password: string;

  /**
   * Relationship with orders - a user can have multiple orders
   * Using string reference pattern to avoid circular dependencies
   */
  @OneToMany('Order', 'readyBy')
  orders: { id: number; readyBy: string }[];

  /**
   * User role for authorization
   */
  @Column({ type: 'enum', enum: Role, default: Role.Salesman })
  role: Role;

  /**
   * When the user was created
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  /**
   * When the user was last updated
   */
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
