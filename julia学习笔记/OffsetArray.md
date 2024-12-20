委托模式源码

```julia

struct OffsetArray{T,N,AA <:AbstractArray } <: AbstractArray{T,N}
	parent::AA
	offsets::NTuple{N,Int} 
	@inline 
	function OffsetArray{T,N,AA}(parent::AA,offsets::NTuple;checkoverflow=true) 
	   where {T, N,AA<:AbstractArray{T,N}}
        # allocation of `map` on tuple is optimized away
        checkoverflow && map(overflow_check, axes(parent), offsets)
        new{T, N, AA}(parent, offsets)
    end
end

Base.parent(A::OffsetArray) = A.parent
Base.size(A::OffsetArray) = size(parent(A))
Base.size(A::OffsetArray，d) = size(parent（A),d)
Base.eachindex(::IndexCartesian,A::offsetArray) = CartesianIndices(axes(A))
Base.eachindex(::IndexLinear,A::OffsetVector) = axes(A,1)

const OffsetVector{T,AA <: AbstractVector{T}} = OffsetArray{T,1,AA}


julia> 1:3 |> typeof
UnitRange{Int64} 
	<: AbstractUnitRange{Int64} 
		<: OrdinalRange{Int64, Int64}
			<: AbstractRange{Int64}
				<: AbstractVector{Int64} (alias for AbstractArray{Int64, 1})
```