using NetTopologySuite.Geometries;
using Pims.Core.Extensions;
using System;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Pims.Core.Converters
{
    /// <summary>
    /// GeometryJsonConverter class, provides a way to serialize and deserialize geometry objects.
    /// </summary>
    public class GeometryJsonConverter : JsonConverter<Geometry>
    {
        #region Methods
        /// <summary>
        /// Deserialize a geometry object.
        /// </summary>
        /// <param name="reader"></param>
        /// <param name="typeToConvert"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        public override Geometry Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            // TODO: Deserialize other geometric shapes.
            return reader.TokenType switch
            {
                JsonTokenType.String => Create(typeToConvert, reader.GetString()),
                _ => null,
            };
        }

        /// <summary>
        /// Serialize a geometery object.
        /// </summary>
        /// <param name="writer"></param>
        /// <param name="value"></param>
        /// <param name="options"></param>
        public override void Write(Utf8JsonWriter writer, Geometry value, JsonSerializerOptions options)
        {
            switch (value.GeometryType)
            {
                case Geometry.TypeNamePoint:
                    var point = value as Point;
                    writer.WriteStartArray();
                    writer.WriteNumberValue(point.X);
                    writer.WriteNumberValue(point.Y);
                    writer.WriteEndArray();
                    break;
                case Geometry.TypeNamePolygon:
                    var polygon = value as Polygon;
                    writer.WriteStartArray();
                    polygon.Coordinates.ForEach(c =>
                    {
                        writer.WriteStartArray();
                        writer.WriteNumberValue(c.X);
                        writer.WriteNumberValue(c.Y);
                        writer.WriteEndArray();
                    });
                    writer.WriteEndArray();
                    break;
            }
        }

        /// <summary>
        /// Create a Geometry of the specified type 'T'.
        /// </summary>
        /// <param name="value"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        private Geometry Create<T>(string value)
            where T : Geometry
        {
            return Create(typeof(T), value);
        }

        /// <summary>
        /// Create a Geometry of the specified 'type'.
        /// </summary>
        /// <param name="type"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        private Geometry Create(Type type, string value)
        {
            if (String.IsNullOrWhiteSpace(value)) return null;

            switch (type.Name)
            {
                case nameof(Point):
                    {
                        var values = value.Split(',').Select(v => double.Parse(v)).ToArray();
                        return new Point(new Coordinate(values[0], values[1]));
                    }
                default:
                    return null;
            }
        }
        #endregion
    }
}
