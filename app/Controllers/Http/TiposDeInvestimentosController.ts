import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { StatusCodes } from 'http-status-codes'

export default class TiposDeInvestimentosController {
  public async index(_: HttpContextContract) {
    const list = await Database
      .from('tipos_de_investimentos')
      .select('*')
      .orderBy('nome', 'asc')
      .paginate(1, 10)

    return list
  }

  public async store(ctx: HttpContextContract) {
    const { nome } = ctx.request.body()

    try {
      const isDuplicated = (await Database.from('tipos_de_investimentos').where('nome', nome)).length > 0
      if (isDuplicated) {
        ctx.response.status(StatusCodes.BAD_REQUEST)

        return { errors: { nome: 'Valor não pode estar duplicado' } }
      }

      const [id] = await Database.table('tipos_de_investimentos').insert({ nome })

      ctx.response.status(StatusCodes.CREATED)

      return id
    } catch (error) {
      ctx.response.status(StatusCodes.BAD_REQUEST)

      return { errors: { default: 'Erro ao inserir o registro' } }
    }
  }

  public async show(ctx: HttpContextContract) {
    const { id } = ctx.params

    try {
      const item = await Database
        .from('tipos_de_investimentos')
        .select('*')
        .where('id', id)
        .first()

      return item
    } catch (error) {
      ctx.response.status(StatusCodes.BAD_REQUEST)

      return { errors: { default: 'Erro ao consultar o registro' } }
    }
  }

  public async update(ctx: HttpContextContract) {
    const { nome } = ctx.request.body()
    const { id } = ctx.params

    try {
      const isDuplicated = (
        await Database.from('tipos_de_investimentos').where('nome', nome).andWhere('id', '!=', id)
      ).length > 0
      if (isDuplicated) {
        ctx.response.status(StatusCodes.BAD_REQUEST)
        return { errors: { nome: 'Valor não pode estar duplicado' } }
      }

      await Database.from('tipos_de_investimentos').where('id', '=', id).update({ nome })
      ctx.response.status(StatusCodes.NO_CONTENT)

      return
    } catch (error) {
      ctx.response.status(StatusCodes.BAD_REQUEST)
      return { errors: { default: 'Erro ao atualizar o registro' } }
    }
  }

  public async destroy(ctx: HttpContextContract) {
    const { id } = ctx.params

    try {
      await Database.from('tipos_de_investimentos').where('id', '=', id).delete()
      ctx.response.status(StatusCodes.NO_CONTENT)
      return
    } catch (error) {
      ctx.response.status(StatusCodes.BAD_REQUEST)
      return { errors: { default: 'Erro ao apagar o registro' } }
    }
  }
}
