import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Emprestimo from 'App/Models/Emprestimo'
import Livro from 'App/Models/Livro'
import User from 'App/Models/User'

export default class EmprestimosController {
    public async store({request,response}:HttpContextContract){

        const data = request.only(['userId','livroId','date','prazo','ativo','status'])
        if(await Livro.find(data.livroId)==null) return response.status(404).send("Livro não encontrado!")
        
        if(await User.find(data.userId)==null) return response.status(404).send("Aluno não encontrado!")
        
        const livroP = await Emprestimo.query().where('livro_id',data.livroId).andWhere('ativo',true) 
        if(livroP.length > 0) return response.status(400).send("Livro já emprestado!")
        
        const alunoP = await Emprestimo.query().where('user_id',data.userId).andWhere('status','a') 
        if(alunoP.length > 0) return response.status(400).send("Aluno com empréstimo atrasado!")

        const emprestimo = await Emprestimo.create(data)

        response.status(201)
        return{
            data:emprestimo
        }
    }
    public async index({}:HttpContextContract){
        const emprestimos =  await Emprestimo.all()
        this.verificaData(emprestimos)
        return{
            data:this.verificaData(emprestimos)
        }
    }
    public async show({params}:HttpContextContract){
        const emprestimos =  await Emprestimo.findOrFail(params.id)
        return{
            data:emprestimos
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
        const dataAtual = new Date();
        emprestimos.forEach(e =>{
            const dataEmprestimo = new Date(e.date)
            const dataDevolucao = new Date(dataEmprestimo.getTime() + e.prazo * 86400000);
              if(dataDevolucao<dataAtual && e.status != 'a' && e.ativo){
                e.status = 'a'
                 e.save()
              }
        })
        return emprestimos
    } 
}
