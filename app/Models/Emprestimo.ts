import { BaseModel, belongsTo, BelongsTo, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime, DurationObjectUnits } from 'luxon'

import Livro from './Livro'
import User from './User'

export default class Emprestimo extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @belongsTo(()=> User,{
    localKey:'id'
  })
  public user: BelongsTo<typeof User>

  @belongsTo(()=> Livro,{
    localKey:'id'
  })
  public livro: BelongsTo<typeof Livro>

  @column.dateTime({autoCreate:true})
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
