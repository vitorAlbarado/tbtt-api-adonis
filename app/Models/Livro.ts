import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Emprestimo from './Emprestimo'

export default class Livro extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({columnName:'emprestimos_id'})
  public emprestimoId:number

  @belongsTo(()=>Emprestimo,{foreignKey:'emprestimosId'})
  public emprestimo: BelongsTo<typeof Emprestimo>

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
