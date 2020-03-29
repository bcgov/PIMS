using AutoMapper;

namespace Pims.Api.Profiles.Extensions
{
    /// <summary>
    /// MappingExpressionExtensions static class, provides extension methods for automapper IMappingExpression.
    /// </summary>
    public static class MappingExpressionExtensions
    {
        /// <summary>
        /// Ignores all unmapped members.
        /// </summary>
        /// <param name="expression"></param>
        /// <typeparam name="TSource"></typeparam>
        /// <typeparam name="TDest"></typeparam>
        /// <returns></returns>
        public static IMappingExpression<TSource, TDest> IgnoreAllUnmapped<TSource, TDest>(this IMappingExpression<TSource, TDest> expression)
        {
            expression.ForAllMembers(opt => opt.Ignore());
            return expression;
        }
    }
}
