import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index({}: HttpContextContract) {
    const users = await User.all()
    return{
      data:users
    }
  }

  public async store({request, response}: HttpContextContract) {
    const data = request.body()
    const users = await User.create(data);
    return {
      message:'Aluno cadastrado com sucesso!',
      data:users
    }
  }

  public async show({params}: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    return{
      data:user
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
