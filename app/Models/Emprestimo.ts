import { DateTime, DurationObjectUnits } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Livro from './Livro'
import User from './User'

export default class Emprestimo extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @hasOne(()=> Livro)
  public livro: HasOne<typeof Livro>

  @hasOne(()=> User)
  public user: HasOne<typeof User>

  @column()
  public date: DateTime

  @column()
  public livroId:number

  @column()
  public userId:number

  @column()
  public ativo: boolean

  @column()
  public status: string

  @column()
  public prazo:number


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
