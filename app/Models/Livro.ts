import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class Livro extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public titulo: String

  @column()
  public autor: String

  @column()
  public descricao: String
  
  @column()
  public image: String

  @column()
  private genero : []

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
