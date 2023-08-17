import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
  
  Route.get('/', async ()=>{
    return 'Hello'
  })
  Route.resource('livros',"LivrosController").apiOnly()
  Route.resource('users',"UsersController").apiOnly()
  Route.resource('emprestimos',"EmprestimosController").apiOnly()

}).prefix('/api')

