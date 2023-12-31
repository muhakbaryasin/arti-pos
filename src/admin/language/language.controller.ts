import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query, Redirect, Render } from "@nestjs/common";
import { LanguageService } from "./language.service";
import { Language } from "./language.entity";

@Controller('/admin/languages')
export class LanguageController {
    constructor(private readonly languageService: LanguageService) {}

    @Get('/')
    @Render('features/admin/language/index')
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit') limit: number,
        @Query('searchTerm') searchTerm: string
    ) {
        const serviceParam = {
            options: {
                page: page,
                limit: limit || 10,
                route: '/admin/language' + (searchTerm ? '?searchTerm=' + searchTerm : '')
            },
            searchTerm: searchTerm || ''
        }

        const data = {
            title: 'Language',
            languages: await this.languageService.findAll(serviceParam),
            searchTerm: searchTerm
        }

        return {
            data: data
        }
    }

    @Post('/store')
    @Redirect('/admin/languages')
    async store(@Body() body) {
        const language = new Language();

        language.setName(body.name);
        await this.languageService.createOrUpdate(language);
    }

    @Get('/:id')
    @Render('features/admin/language/edit')
    async edit(@Param('id') id: number) {
        const data = {
            title: 'Edit Language',
            language: await this.languageService.findOne(id)
        }

        return {
            data: data
        }
    }

    @Post('/:id/update')
    @Redirect('/admin/languages')
    async update(
        @Body() body,
        @Param('id') id: number,
    ) {
        const language = await this.languageService.findOne(id);

        language.setName(body.name);
        await this.languageService.createOrUpdate(language);
    }

    @Post('/:id')
    @Redirect('/admin/languages')
    remove(@Param('id') id: number) {
        return this.languageService.remove(id);
    }

}