# 基本类型
略
# 复合类型

设计抽象类型和具体类型 Julia的类型系统是其许多语言功能（例如多重分派）的基础。

## 内容:
设计抽象类型 

设计具体类型 

理解isA和<:运算符

理解抽象类型和具体类型之间的区别 


## 抽象类型

Julia与大多数其他语言不同的独特之处设计在于定义的**抽象类型 没有任何字段**。

由于这个原因，抽象类型没有指定实际如何将数据存 储在内存中。乍一看似乎有些限制，但是随着我们对Julia的了解越来 越多，在本设计中使用它时似乎更加自然。

抽象类型仅用于为 一组对象的**行为**建模，而**不用于指定**如何**存储数据**。

> 具体类型用于定义数据的组织方式。

示例:
```julia
abstract type Asset end  
describe(a::Asset) = "Something valuable 资产"

abstract type Property <: Asset end
describe(e::Property) = "Physical property 固定资产"

abstract type Investment <: Asset end
describe(e::Investment) = "Financial investment 财务投资"

abstract type Cash <: Asset end # 现金资产  

abstract type House <: Property end # 固定资产

abstract type Apartment <: Property end # 固定资产  

abstract type Equity <: Investment end # 权益；产权
```
### 函数行为 
实现

具有层次结构的原因是为了创建有关类型的常见行为的抽象。例 如，Apartment和House类型具有相同的超类型Property。有意这么继 承是因为它们都代表**固定资产**。因此我们可以为任何 Property定义一个函数，如下所示：
```julia
location(p::Property) = error("Location is not defined in the concrete type")
```

Property的任何**具体类型**访问位置时都必须实现location函数

## 具体类型
在Julia中，有两种具体类 型：
- 原始类型 - 基本类型
- 复合类型 - 由基本类型或复合类型组成

复合类型使用struct关键字定义

```julia
[mutable] struct Stock [<: Equity]
     symbol:: Symbol
     name:: String
end
```

**具体类型可以使用构造函数**
```julia
struct Rectangle
	top::Int
	left::Int
	bottom::Int
	right::Int
	# 构造函数
	Rectangle(p::Position,s::Size) = new(p.y+s.height,p.x,p.y,p.x+s.width)
end
```
## 类型推断
向量组成, 由向量元素中最近的祖先作为向量的统一类型;
```julia
assets = [Stock(), Building()] # Asset 向量		
```
指定类型
```julia
things = Union{Art, Asset}[Monalisa(), Stock()]
```

### 类型判断
`isa` 运算符: object isa Type
`<:` 运算符:   Type1 <: Type2



### 协变 逆变 不变 双变
协变 convariant
逆变 contravariant
不变 invariant
双变 --
#### 不变 invariant 
##### Julia 参数化类型
type-parametric types as invariant

> 对于来自OOP背景的人来说，这是第一个惊喜，因为对他们来说参 数化类型通常是协变的。

```julia
adopt(ms:: Array{Mammal, 1}) = "Adopted " * string(ms)

adopt([Cat("Felix"),Cat("Garfield")]) # Error 
# ERROR:MethodError:no method matching adopt(::Array{Cat,1})
```
Array{Mammal,1}实际上表示Mammal对象的一维数组，其中每个对象都 可以是Mammal的任何子类型。这个没问题.

但由于每种具体类型可能有不同的**内存布局**要求，因此该数组必须存储**指针**而不是**实际值**。另一种说法是将**对象装箱**。

为了分派此方法，我们必须创建一个Array[Mammal，1}。这可以通
过将Mammal作为数组构造函数的前缀来实现，如下所示：
```julia
adopt(Mammal[Cat("Felix")，Cat("Garfield"）])
# 或者 使用"泛型" 这里叫"类型表达式"
function adopt(ms:Array(T，1)) where {T<:Mammal)
	return "accepted same kind:*string(ms)"
end


adopt([Cat("Felix"), Cat("Garfield")]) # 泛型 Array{T,1}) where {T <: Mammal}

adopt([Dog("Clifford"), Dog("Astro")]) # 泛型 Array{T,1}) where {T <: Mammal}

adopt([Cat("Felix"), Dog("Clifford")]) # 原型 Array{Mammal,1}
```

在Julia中，出于实际原因，选择使 **参数化类型不变** 是一种**有意识**的设计决策
[Reason behind designing parametric types as invariant](https://discourse.julialang.org/t/reason-behind-designing-parametric-types-as-invariant/18971)
开发者回应: 
 when someone writes
`f(strs::Vector{AbstractString})`
you often should have written
`f(strs::Vector{<:AbstractString})`

But then again, what if it was

`f!(strs::Vector{AbstractString})`

and `f!` tries to insert a string of a particular type into `strs`? Maybe that’s fine because Julia generally does automatic conversion for you in such situations which should actually work as desired. On the other hand, how hard is it to write
`f!(strs::Vector{<:AbstractString})`
if that’s what you want? 
**Invariance is the simplest, least dangerous variance, so shouldn’t it be the default and easiest to express?**

当数组包含具体类型的对象时，可以分配内存以非常紧 凑的方式存储这些对象。另外，当一个数组包含装箱的对象时，对元 素的每次引用都将涉及取消对指针的引用以找到该对象，从而导致性 能下降。

区别
```julia
f(::T, ::P{T}) where {T<:S} # T 可以是抽象的
f(::T, ::P{<:T}) where {T<:S} # T必须是抽象的, 对角线原则 ? 有点不理解
```
## 参数化表达式 type-parametric expression
在参数化表达式中, 
```julia
(::P{T}) where {T<:S} # 等效于
(::P{<:S})
```
但是在普通参数类型(非参数化类型)中,因为语法的关系, 不能写成 `x:: {<: S}` 必须写成 `x:: T where {T<:S}`, 但是在非参数化类型中, 因为协变的关系,这个不需要写 `T where {T<: S}`
### 协变 covariant
#### 参数协变(元组协变)
方法参数是协变的，这应该非常直观，因为这就是当今多重分派 的工作方式

在Julia中，方法参数正式表示为元组。
>在猫狗的示例中，方法参数just 是Tuple {Mammal,Mammal}。
```julia
julia> Tuple{Cat,Cat} <:Tuple{Mammal,Mammal}
true
julia> Tuple{Cat,Dog} <: Tuple[Mammal,Mammal}
true
julia> Tuple{Dog,Cat} <: Tuple{Mammal,Mammal}
true
julia> Tuple{Dog,Dog} <: Tuple{Mammal,Mammal}
true

julia> Tuple{Cat,Crocodile} <:Tuple{Mammal,Mammal}
false!!
```
如何确定一个函数是否在分派过程中是另一个函 数的子类型？
#### 函数协变

先看all的定义
```julia

all(x::Tuple{Bool,Bool,Bool}) in Base at tuple.jl:390
all(x::Tuple{Bool,Bool}) in Base at tuple.jl:389
all(x::Tuple{Bool}) in Base at tuple.jl:388
all(x::Tuple{}) in Base at tuple.jl:387
all(B::BitArray) in Base at bitarray.jl:1627
all(a::AbstractArray; dims) in Base at reducedim.jl:664
all(f::Function, a::AbstractArray; dims) in Base at reducedim.jl:665
all(itr) in Base at reduce.jl:642
all(f, itr) in Base at reduce.jl:724
## 实现
all(x::Tuple{}) = true
all(x::Tuple{Bool}) = x[1]
all(x::Tuple{Bool, Bool}) = x[1]&x[2]
all(x::Tuple{Bool, Bool, Bool}) = x[1]&x[2]&x[3]

## 位
function all(B::BitArray)
    isempty(B) && return true
    Bc = B.chunks
    @inbounds begin
        for i = 1:length(Bc)-1
            Bc[i] == _msk64 || return false # _msk64 就是 ~UInt64(0)
        end
        Bc[end] == _msk_end(B) || return false
    end
    return true
end

```
用于判断奇偶的写法
```julia
all(isodd, (1,3,5))
all(iseven, [2,4,6])
# 但是不能这样写
all(println, [1,2,3]) # 不安全调用
```
解剖如下
```julia
typeof(isodd)
typeof(isodd) (singleton type of function isodd, subtype of Function)
supertype(typeof(iseven)) == Function # 抽象类型 isabstracttype(Function) == true
```
如果想限定 all的第一个参数, 可以这么写
```julia
 const SignFun = Union{typeof(isodd),typeof(iseven)}
 all_sign(f::SignFun, a::Vararg) = all(f, a...);
```

> 1.  当然，这样做会严重限制该函数的实用性。我们还必须枚举所有可能通过的函数，而这并非总是可行的。因此，处理函数参数的方法受到一定限制。
> 2. 但当所有函数都是最终函数并且所有函数只有一个超类型时，实际上没有什么可介绍的。
> 3. 在设计软件实践中，我们确实关心函数的类型。如前面的示例所示，all函数只能与带有单个参数并返回布尔值的函数一起使用。那应该是接口契约


###### 接口契约

但我们如何执行该契约？最终，我们需要更好地了解调用方和被调用方之间的函数和接口契约。契约可以看作是方法参数和返回类型的组合。让我们在下一节中找出是否有更好的方法来解决此问题。

尽管Julia在形式化函数类型方面没有提供太多帮助，但是它并没有阻止我们自己进行分析。在某些强类型的静态OOP语言中，函数类型更正式地定义为**方法参数和返回类型**的**组合**。
假设一个函数接受三个参数并返回一个值。然后我们可以用以下符号描述该函数：
```julia
# Tuple<T1, T2, T3> -> T4
female_dogs=[Dog("Pinky"），Dog("Pinny")，Dog("Moonie"）]
female_cats=[Cat("Minnie"),Cat（"Queenie"),Cat("Kittie")]
select(::Type{Dog})=rand(female_dogs）
select(::Type{Cat})=rand(female_cats)
```

##### 函数类型的返回类型是协变的
> 返回原函数(finder)的返回类型的子类型的任何其他函数(替代函数)也将起作用.
> 例子中, 猫狗可以, 鳄鱼不行(非Mamal的子类型)

##### 函数的参数是**不变**的 
*此书此处缺乏说服力,可以逆变*
    **证明**: 如果是协变的, 那么接受子类型参数的替代函数,无法接受更抽象的参数.
		    例子中, buddy只接受猫, 所以 基于Mammal的入参可能调用失败.
         如果是**逆变**的, 那么必须接受超类型参数的替代函数, 接受的可能不是哺乳动物..?
		   书中说法无说服力 
	         > 好吧，如果要成为逆变的，finder函数必须接受Mammal的超类型。在我们的动物界中，唯一的超类型是Vertebrate。但是，Vertebrate是抽象类型，无法构造。如果我们实例化任何其他具体类型是Vertebrate的子类型，那么它就不会是哺乳动物（否则，它已经被认为是哺乳动物）。因此，函数参数是不变的。
			> 实测: 
			`contra_test(::Vertebrate) = rand(union(female_cats, female_dogs))`

正式的表达式:
```julia
f: Tuple<Mammal> -> Mammal
g: Tuple<T> -> S where T = Mammal, S<:Mammal # 此书此处`=`应可以替换为<:
```

#### 函数类型分派
以Base中的`all`函数为例，如果我们可以设计一个表示断言函数的类型，而不是在传递不兼容的函数时让它们都失败，那该多好啊。
```julia
struct Predicate(T,S)
f::Function
end
```
这样构造处理的函数传递给`all`, 则不会失败
`Predicate{Number,Bool}(iseven 或 isodd)`

Julia支持可调用的结构，因此我们可以很方便地做到这一点，从而可以像调用函数本身一样调用Predicate结构。为此，我们可以定义以下函数：

```julia
(pred::Predicate{T,S})(x::T;kwargs...)) where {T,S} = pred.f(x;kwargs...)
```
测试:
```julia
Predicate{Number,Bool}(iseven)(1)
false
Predicate{Number,Bool}(iseven)(2)
true
```
让我们定义自己的all函数的安全版本，如下所示
```julia
function safe_all(pred::Predicate{T,S},a::AbstractArray)
							    where {T<：Any，S<：Bool}
	all(pred,a)
end
```