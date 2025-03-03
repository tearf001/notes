## [Custom variants](https://tailwindcss.com/docs/hover-focus-and-other-states#custom-variants)

Arbitrary variant 也是 Custom Variant

和 `注册的 Custom Variant` 的区别仅仅在于`是否注册`.

 目的都是 `custom selector variants`

同样得到的是 Arbitrary selector variants 和 registered custom selector variant

注册语法是 

```css
@custom-variant pointer-coarse {
  @media (pointer: coarse) {
    @slot;
  }
}
/*short-handed*/
@custom-variant pointer-coarse (@media (pointer: coarse));
```

完整 cv(custom variant) 和 scv(short-hand custom variant)的**语法区别**有两处:

- short-handed使用的 `()` 

  ```css
  @custom-variant theme-midnight (&:where([data-theme="midnight"] *));
  ```
  
  你可以认为
  
  ```css
  @custom-variant scv (conditional statement)
      ===
  @custom-variant cv {
      (conditional statement){
          @slot
      }
  }
  ```
  
  
  
- 完整的使用 `{}`, @media 还可以应用样式,包括 `{ @slot }`. 因为它是支持`multiple rules`,

  并且规则之间还可以互相嵌套(can be nested within each other)

  ```css
  @custom-variant any-hover { /*这里面的any-hover 是一个任意值*/
    @media (any-hover: hover) { /*any-hover 是一个feature, 它不同于variant*/
      &:hover {
        @slot;
      }
    }
  }
  /*他最终生成*/
  @layer utilities {
    .any-hover\:bg-amber-500 {
      @media (any-hover: hover) {
        &:hover {
          background-color: var(--color-amber-500);
        }
      }
    }
  }
  /*另一个例子*/
  @custom-variant cv {
    &:where([data-theme="midnight"] *) {
      color: var(--color-amber-500);
      @slot;
    }
  }
  ```

# 指令@variant 和 @custom-variant

前者是像是在 apply `条件`变体, 当在 `参数`变体的 约束下, 应用样式.

```css
.my-element {
  background: white;
  @variant dark {
    background: black;
  }
}
/*nested*/
.my-element {
  background: white;
  @variant dark {
    @variant hover {
      background: black;
    }
  }
}
```

# @custom-variant

`Add` a custom variant in your project:

```css
@custom-variant pointer-coarse (@media (pointer: coarse));
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

