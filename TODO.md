* Babel plugin to replace our hooks with original ones
* Integrate https://api-extractor.com/
* JSFiddle for examples
* Ability to wrap component to log props changes
  - Show props diff with smth like `const Wrapped = LogWrapper(Component); ... ; <Wrapped __name="instance_name" ...props />`
* Return hooks via several names, e.g. `useState` and `useStateLogging`
* `useCallback`
  - support `react-hooks/exhaustive-deps`
  - log return value
  - log exceptions
