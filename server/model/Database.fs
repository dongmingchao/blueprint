namespace server.model

open Microsoft.EntityFrameworkCore
open System

module Database =

    [<PrimaryKey("Id")>]
    type Link() =
      [<DefaultValue>]
      val mutable private id : int
      member this.Id
          with get() = this.id
          and set(value) = this.id  <- value
      member val socketName = "" with get, set

    // type BlogEntityTypeConfiguration() =
    //   interface IEntityTypeConfiguration<Link> with
    //     override x.Configure(builder) =
    //       builder.ToTable()

    [<PrimaryKey("ProductId")>]
    type Product() =
      [<DefaultValue>]
      val mutable private id : int
      member this.ProductId
          with get() = this.id
          and set(value) = this.id  <- value
      member val Price: double = 0 with get, set
      member val Description: string = "" with get, set

    type [<PrimaryKey("OrderItemId")>] OrderItem() =
      member val OrderItemId: int = 0 with get, set
      member val Quantity: int = 0 with get, set
      [<DefaultValue>]
      val mutable private product : Product
      member this.Product
          with get() = this.product
          and set value = this.product <- value

    and [<PrimaryKey("OrderId")>] Order() =
        member val OrderId: int = 0 with get, set
        member val Items: OrderItem list
        [<DefaultValue>]
        val mutable private createdDate : DateTime
        member this.CreatedDate
            with get() = this.createdDate
            and set value = this.createdDate <- value

    and DatabaseContext() =
      inherit DbContext()


      [<DefaultValue>]
      val mutable persons : DbSet<Product>
      member public this.Products
        with get() = this.persons
        and set p = this.persons <- p
      [<DefaultValue>]
      val mutable links: DbSet<Link>
      member public this.Links
        with get() = this.links
        and set v = this.links <- v

      override x.OnConfiguring(opbuilder) =
        let _ = opbuilder.UseSqlite("DataSource=db/test.db")
        ()

      override x.OnModelCreating(builder) =
        ()
