import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
