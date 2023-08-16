import Route from '@ioc:Adonis/Core/Route'

Route.get('/', "exibirMensagem")

const exibirMensagem = () =>{

  return "Hello World";
}
