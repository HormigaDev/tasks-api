import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('attachments')
export class Attachment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    type: string;

    @Column({ name: 'file_url', type: 'text', nullable: false })
    url: string;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    private buffer: Buffer<Uint8Array<ArrayBufferLike>>;

    setBuffer(buffer: Buffer<Uint8Array<ArrayBufferLike>>) {
        this.buffer = buffer;
    }

    getBuffer(): Buffer<Uint8Array<ArrayBufferLike>> {
        return this.buffer;
    }
}
