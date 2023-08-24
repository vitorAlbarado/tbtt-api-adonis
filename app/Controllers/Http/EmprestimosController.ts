import { Response } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Emprestimo from 'App/Models/Emprestimo'
import Livro from 'App/Models/Livro'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class EmprestimosController {
    public async store({request,response}:HttpContextContract){

        const data = request.only(['userId','livroId','prazo','ativo','status'])
        console.log(data)

        const alunoP = await Emprestimo.query().where('user_id',data.userId).andWhere('status','a') 
        if(alunoP.length > 0) return response.status(400).send("Aluno com empréstimo atrasado!")
        
        const livroP = await Emprestimo.query().where('livro_id',data.livroId).andWhere('ativo',true) 
        if(livroP.length > 0) return response.status(400).send("Livro já emprestado!")

        const emprestimo = await Emprestimo.create(data)

        return{
            response:response.status(201).send("Cadastro realizado!"),
            data:emprestimo
        }
    }
    public async index({request}:HttpContextContract){
        const page = request.qs().page
        const pageSize = request.qs().pageSize
        const orderBy = request.qs().orderBy
        const emprestimos =  await Emprestimo.query().preload('user').preload('livro').orderBy(orderBy,'asc').paginate(page, pageSize)
        return{
            emprestimos:this.verificaData(emprestimos)
        }
    }
    public async show({params,response}:HttpContextContract){
        const emprestimo =  await Emprestimo.query().preload('livro').preload('user').where('user_id',params.id)
        if(emprestimo.length == 0){
           return response.status(404).send('Livro não encontrado')
        }
        //const emprestimo =  await Emprestimo.query().preload('livro').preload('user').where('status',params.id)
        //const emprestimo =  await Emprestimo.query().preload('livro').preload('user').where('user_id',params.id)
        return{
            emprestimo
        }
    }
    public async listaEmprestimos({}:HttpContextContract){
        const emprestimos = await Emprestimo.query().preload('user').preload('livro')
        console.log(emprestimos)
        return {
            emprestimos
        }
    }
    public async findPopulares ({}:HttpContextContract){
        //select livro_id, count(livro_id) as mais_populares from emprestimos group by livro_id order by mais_populares desc;
        const livros = (await Emprestimo.query().select('livro_id').count('livro_id as mais_populares').groupBy('livro_id').orderBy('mais_populares','desc').limit(10).preload('livro'))
        return{
            livros
        }
    }
    public async update({request,params}:HttpContextContract){
        const emprestimo =  await Emprestimo.findOrFail(params.id)
        const data = request.body()
        if(data.prazo && data.prazo !=  emprestimo.prazo){
            emprestimo.prazo = data.prazo
        }
        if(data.status && data.status !=  emprestimo.status){
            emprestimo.status = data.status
        }
        if(data.ativo !=  emprestimo.status){
            emprestimo.ativo = data.ativo
        }
        await emprestimo.save()
        return{
            message:'Emprestimo atualizado com sucesso!',
            data:emprestimo
        }
    }
    public async destroy ({params}:HttpContextContract){
        const emprestimo = await Emprestimo.findOrFail(params.id)
        await emprestimo.delete()
        return{
            message:"Livro deletado com sucesso",
            
        }
    }
    verificaData(emprestimos:Emprestimo[]) {
        const dataAtual = DateTime.now()
        emprestimos.forEach(e =>{
            const dataEmprestimo = e.date
            const dataDevolucao = dataEmprestimo.plus({days:e.prazo})
            if(dataDevolucao<dataAtual && e.status != 'a' && e.ativo){
                e.status = 'a'
                e.save()
            }
            if(dataDevolucao>dataAtual && e.ativo){
                e.status = 'e'
                e.save()
            }
        })
        return emprestimos
    } 
}
