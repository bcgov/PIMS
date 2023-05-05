using Microsoft.Extensions.DependencyInjection;
using Moq;
using Pims.Core.Extensions;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace Pims.Core.Test
{
    /// <summary>
    /// TestHelperExtensions static class, provides extension methods for TestHelper.
    /// </summary>
    [ExcludeFromCodeCoverage]
    public static class TestHelperExtensions
    {
        #region Methods

        /// <summary>
        /// Mock all constructor arguments of the specified type of 'T'.
        /// Will only work with a type that has a single constructor.
        /// Will use any 'args' passed in instead of generating defaults.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="args"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static KeyValuePair<Type, object>[] MockConstructorArguments<T>(this TestHelper helper, params object[] args)
        {
            var type = typeof(T);
            var constructors = type.GetCachedConstructors();
            var ci = constructors.SingleOrDefault() ?? throw new ArgumentException($"The type '{type.Name}' must only have one constructor.");

            var tempProvider = helper.Services.BuildServiceProvider();

            var types = new List<KeyValuePair<Type, object>>();
            var gmock = typeof(Mock<>);
            var cargs = ci.GetParameters();
            foreach (var carg in cargs)
            {
                var exists = tempProvider.GetService(carg.ParameterType);// helper.Services.FirstOrDefault(sd => sd.ServiceType == carg.ParameterType);
                if (exists != null)
                {
                    types.Add(new KeyValuePair<Type, object>(carg.ParameterType, exists));
                    continue;
                }

                // If an 'args' type matches, use it for the mock.
                var arg = args.FirstOrDefault(a => a.GetType() == carg.ParameterType);
                if (arg == null) arg = args.FirstOrDefault(a => carg.ParameterType.IsAssignableFrom(a.GetType()));
                if (arg != null)
                {
                    // Add the supplied argument to services.
                    helper.AddSingleton(carg.ParameterType, arg);
                    types.Add(new KeyValuePair<Type, object>(carg.ParameterType, arg));
                    continue;
                }

                var gmake = gmock.MakeGenericType(carg.ParameterType);
                var mockObjectProp = gmock.GetCachedProperties().FirstOrDefault(p => p.Name == nameof(Mock.Object) && !p.PropertyType.IsGenericParameter) ?? throw new InvalidOperationException($"The mocked type '{type.Name}' was unable to determine the correct 'Object' property.");

                // Create a Mock and add it and the Object to services.
                var mock = Activator.CreateInstance(gmake);
                var result = mockObjectProp.GetValue(mock);
                helper.AddSingleton(gmake, mock);
                helper.AddSingleton(carg.ParameterType, result);
                types.Add(new KeyValuePair<Type, object>(carg.ParameterType, result));
            }

            return types.ToArray();
        }
        #endregion
    }
}
