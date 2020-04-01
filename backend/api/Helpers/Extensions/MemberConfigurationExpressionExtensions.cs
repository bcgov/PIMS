using AutoMapper;
using Pims.Api.Profiles.Resolvers;
using System;

namespace Pims.Api.Helpers.Extensions
{
    /// <summary>
    /// MemberConfigurationExpressionExtensions static class, provides extension methods for MemberConfigurationExpression objects.
    /// </summary>
    public static class MemberConfigurationExpressionExtensions
    {
        /// <summary>
        /// Provides a way to use a lambda function to map a member.
        /// </summary>
        /// <typeparam name="TSource"></typeparam>
        /// <typeparam name="TDestination"></typeparam>
        /// <typeparam name="TMember"></typeparam>
        /// <param name="config"></param>
        /// <param name="action"></param>
        public static void MapFrom<TSource, TDestination, TMember>(this IMemberConfigurationExpression<TSource, TDestination, TMember> config, Func<TSource, TDestination, TMember, ResolutionContext ,TMember> action)
        {
            config.MapFrom(new ObjectResolver<TSource, TDestination, TMember>(action));
        }
    }
}
