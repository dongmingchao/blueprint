namespace server.controller
open Microsoft.AspNetCore.Mvc
open server.model.Database

[<ApiController>]
[<Route("[controller]")>]
type NodeController() =
    let db = new DatabaseContext()

    [<HttpGet>]
    member _.list() =
      db.Products

    [<HttpGet("{id}")>]
    member _.find(id: int) =
      db.Products.Find(id)

    [<HttpPost("add")>]
    member _.add() =
      let p = new Product()
      p.Description <- "Apple"
      let d = db.Add(p)
      // let _ = db.Products.Add(p)
      let result = db.SaveChanges()
      $"add to db {result} {d}"

    [<HttpGet("link/add")>]
    member x.AddLink() =
      let link = new Link()
      link.socketName <- "result"
      let d = db.Add(link)
      let result = db.SaveChanges()
      $"add a link {d} {result}"
