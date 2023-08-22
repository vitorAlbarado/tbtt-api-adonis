import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuid4} from 'uuid'
import Livro from 'App/Models/Livro'
import Application from '@ioc:Adonis/Core/Application'


export default class LivrosController {
    private validationOptions={
        types:['image'],
        size:'2mb',
    }

    public async store({request, response}:HttpContextContract){
        const data = request.only(['titulo','autor','genero','descricao','image'])
        const image = request.file('image',this.validationOptions)
        if(image){
            const imageName = `${uuid4()}.${image.extname}`
            await image.move(Application.tmpPath('uploads'),{
                name: imageName
            })
            data.image = imageName
        }
        const livro = await Livro.create(data)
        return {
            message:"Livro cadastrado com sucesso!",
            data
        }
    }
    public async index({ }:HttpContextContract){
        const livros = await Livro.query()
        return{
            data: livros
        }
    }
    public async show ({params}:HttpContextContract){
        const livro = await Livro.findOrFail(params.id)
        return{
            data: livro
        }
    }
    public async destroy ({params}:HttpContextContract){
        const livro = await Livro.findOrFail(params.id)
        await livro.delete()
        return{
            message:"Livro deletado com sucesso",
            
        }
    }
    public async update({request, params}:HttpContextContract){
        const body = request.body()
        const livro = await Livro.findOrFail(params.id)
        livro.titulo = body.titulo
        livro.descricao = body.descricao

        if(livro.image != body.image || !livro.image){
            const image = request.file('image',this.validationOptions)

            if(image){
                const imageName = `${uuid4()}.${image.extname}`
                await image.move(Application.tmpPath('uploads'),{
                    name: imageName
                })
                livro.image = imageName
            }
        }
        await livro.save()
        return{
            message:'Livro atualizado!',
            data: livro
        }
    }
}
