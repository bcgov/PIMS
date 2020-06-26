using System;

namespace Pims.Core.Json
{
    /// <summary>
    /// EnumValueAttribute class, provides a way to specify the text value of an enum value.
    /// </summary>
    [AttributeUsage(AttributeTargets.Field, AllowMultiple = false, Inherited = true)]
    public class EnumValueAttribute : Attribute
    {
        #region Properties
        /// <summary>
        /// get/set - The value that should be used when serialized.
        /// </summary>
        public string Value { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an EnumValueAttribute, initializes it with the specified arguments.
        /// </summary>
        /// <param name="value"></param>
        public EnumValueAttribute(string value)
        {
            this.Value = value;
        }
        #endregion
    }
}
