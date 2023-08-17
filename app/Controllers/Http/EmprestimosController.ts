import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Emprestimo from 'App/Models/Emprestimo'
import Livro from 'App/Models/Livro'
import User from 'App/Models/User'

export default class EmprestimosController {
    public async store({request,response}:HttpContextContract){
        const data = request.body()
        await Livro.findOrFail(data.livroId)
        await User.findOrFail(data.userId)
        const emprestimo = await Emprestimo.create(data)
        response.status(201)
        return{
            data:emprestimo
        }
    }
    public async index({}:HttpContextContract){
        const emprestimos =  await Emprestimo.query()
        return{
            data:emprestimos
        }
    }
}
