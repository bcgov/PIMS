/**
 * append the passed name and index to the existing namespace, ideal for nesting forms within formik.
 * @param nameSpace the namespace of the current formik form.
 * @param name the name to append to the namespace, may either be a field name or an object within the form (if passing the namespace to a subform).
 * @param index optional index to append to the namespace and name, used for formik arrays.
 */
export const withNameSpace: Function = (nameSpace?: string, name?: string, index?: number) => {
  return [nameSpace ?? '', `${index ?? ''}`, name].filter(x => x).join('.');
};
