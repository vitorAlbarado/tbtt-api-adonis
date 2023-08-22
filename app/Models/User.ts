import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Emprestimo from './Emprestimo'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  
  @hasMany(()=>Emprestimo,{foreignKey:'userId'})
  public emprestimo: HasMany<typeof Emprestimo>

  @column()
  public nome: string

  @column()
  public email: string

  @column()
  public contato: string

  @column()
  public turma: string


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
