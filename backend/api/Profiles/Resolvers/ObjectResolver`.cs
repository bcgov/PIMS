using AutoMapper;
using System;

namespace Pims.Api.Profiles.Resolvers
{
    /// <summary>
    /// ObjectResolver class, provides a way to debug AutoMapper when it is resolving one type to another.
    /// </summary>
    /// <example>
    ///     .ForMember(dest => dest.Property, opt.MapFrom(new ObjectResolver'SourceType, DestType, MemberType'((s,d,m,c) => { // Do stuff here.})));
    /// </example>
    /// <typeparam name="ST"></typeparam>
    /// <typeparam name="DT"></typeparam>
    /// <typeparam name="DMT"></typeparam>
    public class ObjectResolver<ST, DT, DMT> : IValueResolver<ST, DT, DMT>
    {
        #region Variables
        private readonly Func<ST, DT, DMT, ResolutionContext, DMT> _action;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ObjectResolver object, initializes with specified arguments.
        /// </summary>
        /// <param name="action"></param>
        public ObjectResolver(Func<ST, DT, DMT, ResolutionContext, DMT> action)
        {
            _action = action;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Resolve the source and return the 'destMember'.
        /// </summary>
        /// <param name="source"></param>
        /// <param name="destination"></param>
        /// <param name="destMember"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        public DMT Resolve(ST source, DT destination, DMT destMember, ResolutionContext context)
        {
            return _action(source, destination, destMember, context);
        }
        #endregion
    }
}
