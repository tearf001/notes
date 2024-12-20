#MacroTools
## @forward
```julia
@macroexpand @forward SavingsAccount2.acct balance,deposit!

quote
    balance(var"#n1_x"::SA2, var"#n2_args"...; var"#n3_kwargs"...) = begin
            $(Expr(:meta, :inline)) #= ...\Lazy\9Xnd3\src\macros.jl:297 =#
            balance((var"#n1_x").acct, var"#n2_args"...; var"#n3_kwargs"...)
        end
    deposit!(var"#n4_x"::SA2, var"#n6_args"...; var"#n6_kwargs"...) = begin
            $(Expr(:meta, :inline)) #= ...\Lazy\9Xnd3\src\macros.jl:297 =#
            deposit!((var"n4_x").acct, var"#n6_args"...; var"#n6_kwargs"...)
        end    
    Lazy.nothing #= ...\Lazy\9Xnd3\src\macros.jl:299 =#
end

```
源码 `..\Lazy\9Xnd3\src\macros.jl`
- forward
```julia
  
@forward T.x functions...  
"""
@forward T.x functions...  
	Define methods for `functions` on type `T`, which call the relevant function
	on the field `x`.  
# Example
"""
struct Wrapper
    x
end

@forward Wrapper.x Base.sqrt # sqrt(Wrapper(4.0)) == 2.0
@forward Wrapper.x Base.length, Base.getindex, Base.iterate # tailing as tuple
@forward Wrapper.x (Base.length, Base.getindex, Base.iterate) # equivalent to 上面

macro forward(ex, fs)
  @capture(ex, T_.field_)||error("Syntax: @forward T.x f, g") # 得到 T, 和 field
  T = esc(T) # 转义. 
  fs = isexpr(fs, :tuple) ? map(esc, fs.args) : [esc(fs)] # 转义 元组
  #! field 不需要转义
  :(
	  $(
		  [:(
			  $f(x::$T, args...; kwargs...) = (
				  Base.@_inline_meta; #= Lazy\9Xnd3\src\macros.jl:297 =#
				  $f(x.$field, args...; kwargs...)
			  )
		    ) for f in fs
		  ]...
       ); # end of $(

	nothing) # end of :(
end
```
## @capture
源码 `...packages\MacroTools\src\match\macro.jl`
- capture 
> 注释以`@macroexpand @capture(SavingsAccount2.acct, T_.field_)` 进行

```julia
macro capture(ex, pat)
  bs = allbindings(pat) # (T, field) # 模式绑定
  pat = subtb(subor(pat))  # 模式
  quote
    $([:($(esc(b)) = nothing) for b in bs]...) # 绑定的每个项目初始化为nothing
    env = trymatch($(esc(Expr(:quote, pat))), $(esc(ex)))
    if env === nothing
      false
    else
      $([:($(esc(b)) = get(env, $(esc(Expr(:quote, b))), nothing)) for b in bs]...)
      true
    end
  end
end

function allbindings(pat, bs)
  if isa(pat, QuoteNode)
    return allbindings(pat.value, bs)
  end

  return isbinding(pat) || (isslurp(pat) && pat !== :__) ? push!(bs, bname(pat)) :
  isa(pat, TypeBind) ? push!(bs, pat.name) :
  isa(pat, OrBind) ? (allbindings(pat.pat1, bs); allbindings(pat.pat2, bs)) :
  istb(pat) ? push!(bs, tbname(pat)) :
  isexpr(pat, :$) ? bs :
  isa(pat, Expr) ? map(pat -> allbindings(pat, bs), [pat.head, pat.args...]) :
  bs
end
```
展开
```julia
import MacroTools: trymatch, nothing # core.nothing
@macroexpand @capture(SA2.acct, T_.field_)

quote
    T = nothing
    field = nothing
    #= ..\MacroTools\Cf2ok\src\match\macro.jl:67 =#
    var"#env"=trymatch($(Expr(:copyast,:($(QuoteNode(:(T_.field_)))))), SA2.acct)
    #= ..\MacroTools\Cf2ok\src\match\macro.jl:68 =#
    if var"#env" === nothing
        #=..\MacroTools\Cf2ok\src\match\macro.jl:69 =#
        false
    else
        #= ..\MacroTools\Cf2ok\src\match\macro.jl:71 =#
        T = MacroTools.get(var"#env", :T, nothing)
        field = MacroTools.get(var"#env", :field, nothing)
        #= ..\MacroTools\Cf2ok\src\match\macro.jl:72 =#
        true
    end
end
```

## splitarg
```julia
#=
julia> map(splitarg, (:(f(a=2, x::Int=nothing, y, args...))).args[2:end])
4-element Array{Tuple{Symbol(符),Symbol(类型),Bool(is_splat),Any(默认值)},1}:
 (:a, :Any, false, 2)
 (:x, :Int, false, :nothing)
 (:y, :Any, false, nothing)
 (:args, :Any, true, nothing)  
 =#
 
function splitarg(arg_expr)
    if @capture(arg_expr, arg_expr2_ = default_)
      # This assert will only be triggered if a `nothing` literal was somehow spliced into the Expr.
      # A regular `nothing` default value is a `Symbol` when it gets here. See #178
      @assert default !== nothing "splitarg cannot handle `nothing` as a default. Use a quoted `nothing` if possible. (MacroTools#35)"
    else
       arg_expr2 = arg_expr
    end
    is_splat = @capture(arg_expr2, arg_expr3_...)
    is_splat || (arg_expr3 = arg_expr2)
    (arg_name, arg_type) = (@match arg_expr3 begin
        ::T_ => (nothing, T)
        name_::T_ => (name, T)
        x_ => (x, :Any)
    end)::NTuple{2,Any} # the pattern `x_` matches any expression
    return (arg_name, arg_type, is_splat, default)
end
```
## combinearg
combinearg is the inverse of `splitarg
```julia
function combinearg(arg_name, arg_type, is_splat, default)
    @assert arg_name !== nothing || arg_type !== nothing
    a = arg_name===nothing ? :(::$arg_type) :
        arg_type==:Any && is_splat ? arg_name :   # see #177 and julia#43625
            :($arg_name::$arg_type)
    a2 = is_splat ? Expr(:..., a) : a
    return default === nothing ? a2 : Expr(:kw, a2, default)
end
```

## splitdef
Match any function definition
```julia
function splitdef(fdef)
  error_msg = "Not a function definition: $(repr(fdef))"
  @assert(@capture(longdef1(fdef),
                   function (fcall_ | fcall_) body_ end),
          "Not a function definition: $fdef")
  fcall_nowhere, whereparams = gatherwheres(fcall)
  func = args = kwargs = rtype = nothing
  if @capture(fcall_nowhere, ((func_(args__; kwargs__)) |
                              (func_(args__; kwargs__)::rtype_) |
                              (func_(args__)) |
                              (func_(args__)::rtype_)))
  elseif isexpr(fcall_nowhere, :tuple)
    if length(fcall_nowhere.args) > 1 && isexpr(fcall_nowhere.args[1], :parameters)
      args = fcall_nowhere.args[2:end]
      kwargs = fcall_nowhere.args[1].args
    else
      args = fcall_nowhere.args
    end
  elseif isexpr(fcall_nowhere, :(::))
    args = Any[fcall_nowhere]
  else
    throw(ArgumentError(error_msg))
  end
  if func !== nothing
    @assert(@capture(func, (fname_{params__} | fname_)), error_msg)
    di = Dict(:name=>fname, :args=>args,
              :kwargs=>(kwargs===nothing ? [] : kwargs), :body=>body)
  else
    params = nothing
    di = Dict(:args=>args, :kwargs=>(kwargs===nothing ? [] : kwargs), :body=>body)
  end

  if rtype !== nothing; di[:rtype] = rtype end
  if whereparams !== nothing; di[:whereparams] = whereparams end
  if params !== nothing; di[:params] = params end
  di
end
```

  

## combinedef 
`combinedef` is the inverse of [`splitdef`](@ref). It takes a `splitdef`- like Dict and returns a function definition.  

This function approximately does the following (but more sophisticated to avoid emitting parts that did not actually appear in the original function definition.)

```julia
rtype = get(dict, :rtype, :Any)
all_params = [get(dict, :params, [])..., get(dict, :whereparams, [])...]
:(function \$(dict[:name]){\$(all_typeparams...)}
		(\$(dict[:args]...);\$(dict[:kwargs]...)) ::\$rtype # 返回类型
      \$(dict[:body])
  end)
```

  
```julia
macro q(ex)
	esc(Expr(:quote, striplines(ex))) # Like `quote` keyword without lineumbers
end

function combinedef(dict::Dict)
  rtype = get(dict, :rtype, nothing)
  params = get(dict, :params, [])
  wparams = get(dict, :whereparams, [])
  body = block(dict[:body])
  if haskey(dict, :name)
    name = dict[:name]
    name_param = isempty(params) ? name : :($name{$(params...)})
    # We need the `if` to handle parametric inner/outer constructors like
    # SomeType{X}(x::X) where X = SomeType{X}(x, x+2)
    if isempty(wparams)
      if rtype==nothing
        @q(function $name_param($(dict[:args]...);
                                $(dict[:kwargs]...))
          $(body.args...)
          end)
      else
        @q(function $name_param($(dict[:args]...);
                                $(dict[:kwargs]...))::$rtype
          $(body.args...)
          end)
      end
    else
      if rtype==nothing
        @q(function $name_param($(dict[:args]...);
                                $(dict[:kwargs]...)) where {$(wparams...)}
          $(body.args...)
          end)
      else
        @q(function $name_param($(dict[:args]...);
                                $(dict[:kwargs]...))::$rtype where {$(wparams...)}
          $(body.args...)
          end)
      end
    end
  else
    if isempty(dict[:kwargs])
      arg = :($(dict[:args]...),)
    else
      arg = Expr(:tuple, Expr(:parameters, dict[:kwargs]...), dict[:args]...)
    end
    if isempty(wparams)
      if rtype==nothing
        @q($arg -> $body)
      else
        @q(($arg::$rtype) -> $body)
      end
    else
      if rtype==nothing
        @q(($arg where {$(wparams...)}) -> $body)
      else
        @q(($arg::$rtype where {$(wparams...)}) -> $body)
      end
    end
  end
end