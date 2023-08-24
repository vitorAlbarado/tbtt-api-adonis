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
            response:response.status(201),
            data
        }
    }
    public async index({request}:HttpContextContract){
        const page = request.qs().page
        const pageSize = request.qs().pageSize
        const orderBy = request.qs().orderBy
        const livros =  await Livro.query().orderBy(orderBy,'asc').paginate(page, pageSize)
        return{
            livros
        }
    }
    public async show ({params, response}:HttpContextContract){
        const livro = await Livro.find(params.id)
        if(livro == null) return response.status(404).send('Livro não encontrado')
        return{
            livro
        }
    }
    
    public async findByTitulo({request,response}:HttpContextContract){
        const titulo = request.qs().titulo
        console.log(titulo)
        const livro = await Livro.query().where('titulo','like',`${titulo}%`)
        if(livro.length == 0){
            return response.status(404).send('Livro não encontrado')
        }
        return{
            livro
        }
    }
    public async findByGenero({request,response}:HttpContextContract){
        const genero = request.qs().genero
        const livro = await Livro.query().where('genero','like',`${genero}%`).limit(10)
        if(livro.length == 0){
            return response.status(404).send('Genero não encontrado')
        }
        return{
            livro
        }
    }
    public async listaLivros({response}:HttpContextContract){
        const livros = await Livro.all()
        if(livros.length == 0){
            return response.status(404).send('Livros não encontrados')
        }
        return{
            livros
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
