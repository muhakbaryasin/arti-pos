import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    async findAll(serviceParam?: { options? : IPaginationOptions; searchTerm?: string }): Promise<Pagination<Category>> {
        const queryBuilder = this.categoryRepository.createQueryBuilder();
        
        if (serviceParam?.searchTerm) {
            queryBuilder.where('category.name LIKE :searchTerm', { searchTerm: `%${serviceParam.searchTerm}%` });
        }

        return paginate<Category>(queryBuilder, {
            limit: serviceParam?.options?.limit,
            page: serviceParam?.options?.page,
            route: serviceParam?.options?.route,
        });
    }

    findOne(id: number): Promise<Category | null> {
        return this.categoryRepository.findOneBy({ id });
    }

    findByName(name: string): Promise<Category | null> {
        return this.categoryRepository
                    .createQueryBuilder('category')
                    .where('LOWER(category.name) LIKE LOWER(:name)', { name: `${name}` })
                    .getOne();

    }
    
    createOrUpdate(category: Category): Promise<Category> {
        return this.categoryRepository.save(category);
    }

    async remove(id: number): Promise<void> {
        await this.categoryRepository.delete(id);
    }
}
