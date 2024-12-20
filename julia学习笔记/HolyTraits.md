# 原理
是一种基于julia分派的设计模式

注意:  julia知识补充
> 抽象类型也可以做构造函数
> **没有成员的struct**是 单例`struct`, 可以通过`objectid` 来核实. 以下称 `Truct`

```julia
abstract type Asset end

abstract type Property <: Asset end
abstract type Investment <: Asset end	
abstract type Cash <: Asset end
	
abstract type House <: Property end
abstract type Apartment <:Property end

abstract type FixedIncome <:Investment end
abstract type Equity<: Investment end


struct Residence <: House
	location
end

struct Stock <: Equity
	symbol
	name
end

struct TreasuryBill <: FixedIncome
	cusip
end

struct Money <: Cash
	currency
	amount
end

# trait
## 1th Trait 定义通常是 abt + Truct (trait Struct)
abstract type Liquidity end; # Abt
struct IsLiquid <: Liquidity end; # Tra
struct IsIlliquid <: Liquidity end; # Tra

# 2nd Trait的abt构造函数 (参数为具体类型) Abt(::T) => Truct
Liquidity(::Type{<:Asset}) = IsIlliquid() # global
Liquidity(::Type{<:Cash}) = IsLiquid()
Liquidity(::Type{<:Investment}) = IsLiquid()

# 3rd 逻辑: 转发及实现. 注意这里是简单实现
# logicimpl(::T) where {T} = logicimpl(Abt(T))
# logicimpl(::Tra) = implementation...
tradable(::T) where{T} = tradable(Liquidity(T)) # 转发到abt构造函数=>trait单例struct
tradable(::IsLiquid) = true
tradable(::IsIlliquid) = false

# 测试
tradable(Money(:usd, 1)) # true
tradable(Stock(:stock, "a stock")) # true
tradable(Residence("a residence")) # false
tradable(1) # MethodError: no method matching Liquidity(::Type{Int64})

# 扩展. 1. 从新逻辑, 2. 从调用形式(x类型和Tra类型是松耦合的, 通常以f(::Tra, x) 来实现)
price(x:: T) where {T} = price(Liquidity(T), x)
price(::IsLiquid, x) = error("请实现 价格实现关于, ", typeof(x))
price(::IsIlliquid, x) = error("$x 不可估价")

# 实现
price(x::Money) = x.amount
price(x::Stock) = rand(200, 500)
```

# 常见用法
```julia
abstract type IteratorSize end
struct SizeUnknown <: IteratorSize end # Truct
struct HasLength <: IteratorSize end # Truct
struct HasShape{N} <: IteratorSize end # Truct
struct IsInfinite <: IteratorSize end # Truct

"""
IteratorSize(itertype::Type) -> IteratorSize
"""
IteratorSize(x) = IteratorSize(typeof(x)) # 这里很重要, 转换成类型判断
IteratorSize(::Type) = HasLength() # HasLength is the default

IteratorSize(::Type{<:AbstractArray{<:Any,N}}) where {N} = HasShape{N}()
IteratorSize(::Type{Generator{I,F}}) where {I,F} = IteratorSize(I)
IteratorSize(::Type{Any}) = SizeUnknown() # 只有Any

# test
collect(Iterators.take(Iterators.repeated(1),5))
	Iterators.repeated(1) => Iterators.Repeated{Int}(1)
	Iterators.take(Iterators.repeated(1),5) =>
		Iterators.Take{Iterators.Repeated{Int}}(Iterators.Repeated{Int}(1), 5)

IteratorSize(::Type{<:Repeated}) = IsInfinite()

# Iterators.Repeated(1) == Iterators.repeated(1)
Base.IteratorSize(Iterators.repeated(1)) # Base.IsInfinite()
Base.IteratorSize(typeof(Iterators.repeated(1))) # Base.IsInfinite()
```

# 扩展
## BitArray

```julia
BitArray(Iterators.Repeated(1))
# ERROR: ArgumentError: infinite-size iterable used in BitArray constructor
BitArray(Iterators.repeat(1))
```

## AbstractPlotting, Makie
```julia
################################################################################
#                              Conversion Traits                               #
################################################################################

abstract type ConversionTrait end

const XYBased = Union{MeshScatter, Scatter, Lines, LineSegments}
const RangeLike = Union{AbstractRange, AbstractVector, ClosedInterval}

struct NoConversion <: ConversionTrait end

# No conversion by default
conversion_trait(::Type) = NoConversion()
convert_arguments(::NoConversion, args...) = args

# 基于点的, 比如解析平面集合
struct PointBased <: ConversionTrait end
conversion_trait(x::Type{<: XYBased}) = PointBased()

# 基于Surface表面的
abstract type SurfaceLike <: ConversionTrait end
struct ContinuousSurface <: SurfaceLike end # 连续展露
conversion_trait(::Type{<: Union{Surface, Image}}) = ContinuousSurface()

struct DiscreteSurface <: SurfaceLike end # 离散展露
conversion_trait(::Type{<: Heatmap}) = DiscreteSurface()

# 基于 Volume的
struct VolumeLike <: ConversionTrait end
conversion_trait(::Type{<: Volume}) = VolumeLike()

function convert_arguments end
convert_arguments(::NoConversion, args...; kw...) = args

# 扩展
# 基于栅格的
abstract type GridBased <: ConversionTrait end
# 基于顶点的, 用于表面
struct VertexGrid <: GridBased end
""" (len(xs:v[n*1]), len(ys: v[m*1])) = size(zs:matrix[m*n]) 
或  size(xs) == size(ys) == size(zs) # xs, ys, zs 都是浮点矩阵 多图?.
	See also: [`CellGrid`](@ref), [`ImageLike`](@ref)
	Used for: Surface
"""
conversion_trait(::Type{<: Surface}) = VertexGrid()

# 基于单元格的, 用于热图Heatmap
struct CellGrid <: GridBased end
"""
	(length(xs), length(ys)) == size(zs) .+ 1
	After the conversion the x and y values represent the edges of cells corresponding to z values.
"""
conversion_trait(::Type{<: Heatmap}) = CellGrid()

# 基于图像的, 用于图像
struct ImageLike <: ConversionTrait end
"""
(xs::Interval, ys::Interval, zs::Matrix{Float32}) # xs, ys 标记包含zs的quad限制
"""
struct ImageLike <: ConversionTrait end
conversion_trait(::Type{<: Image}) = ImageLike()
# Rect2f(xmin, ymin, xmax, ymax)

# 扩展 Transformable
abstract type Transformable end

abstract type AbstractPlot{Typ} <: Transformable end
abstract type AbstractScene <: Transformable end
abstract type ScenePlot{Typ} <: AbstractPlot{Typ} end
```


```julia
# convert_arguments(P, x, y)::(Vector) # turns it into a vector of 2D points
function convert_arguments(::PointBased, x::RealVector, y::RealVector)
    return (Point{2,float_type(x, y)}.(x, y),)
end
```

## 说明
```julia

help?> Point2f0 # Point{2, Float32}
search: Point2f0 Point4f0 Point3f0 Point2 Point4 Point Point3 pointer PointBased
  Summary
  ≡≡≡≡≡≡≡
  struct Point{S, T}
  Fields
  ≡≡≡≡≡≡
  data :: NTuple{S, T}
  Supertype Hierarchy
  ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  Point{S, T} 
	  <: GeometryBasics.AbstractPoint{S, T} 
		  <: StaticArraysCore.StaticArray{Tuple{S}, T, 1} 
			  <: AbstractArray{T, 1} 
				  <: Any
```

# 编写特质工具 SimpleTraits[可选]
```julia
# 定义
@traitdef IsLiquid{T}

# 第二步
@traitimpl IsLiquid{Cash}
@traitimpl IsLiquid{Investment}

# 第三步 使用四冒号的特殊语法来定义函数, 这些函数采用表现出特质的对象
@traitfn marketprice(x::::IsLiquid) = error("Please implement .. for",typeof(x))
@traitfn marketprice(x::::(!IsLiquid)) =error("not available for illiquid asset")

```

