import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  

  public async store({request, response}: HttpContextContract) {
    const data = request.body()
    console.log(data)
    const users = await User.create(data);
    console.log(users)

    return {
      message:'Aluno cadastrado com sucesso!',
      response:response.created(users)
    }
  }
  public async index({}: HttpContextContract) {
    const users = await User.query().preload('emprestimo')
    return{
      data:users
    }
  }

  public async show({params,response}: HttpContextContract) {
    const aluno = await User.find(params.id)
    if(aluno == null) return response.status(404).send('Aluno não encontrado')
    return{
      aluno
    }
  }

  public async update({params, request}: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const data = request.body()
    if(data.turma ||  user.turma != data.turma){
      user.turma = data.turma
    }
    if(data.email || user.email != data.email){
      user.email = data.email
    }
    await user.save()
    return{
      message:'Aluno atualizado!',
      data:user
    }
  }

  public async destroy({}: HttpContextContract) {}
}
