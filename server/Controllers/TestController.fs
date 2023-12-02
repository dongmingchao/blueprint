namespace server.Controllers
open Microsoft.AspNetCore.Mvc
open Microsoft.Extensions.Logging

[<ApiController>]
[<Route("[controller]")>]
type TestController (logger : ILogger<TestController>) =
    inherit ControllerBase()

    [<HttpGet>]
    member _.Get() = "Hello123"
