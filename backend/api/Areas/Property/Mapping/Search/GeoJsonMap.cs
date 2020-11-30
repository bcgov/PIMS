using Mapster;
using NetTopologySuite.Geometries;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Property.Models.Search;

namespace Pims.Api.Areas.Property.Mapping.Search
{
    public class GeoJsonMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Models.ProjectProperty, Model.GeoJson<Model.PropertyModel>>()
                .Map(dest => dest.Type, src => "Feature")
                .Map(dest => dest.Geometry.Type, src => src.Location.GeometryType)
                .Map(dest => dest.Geometry.Coordinates, src => src.Location)
                .Map(dest => dest.Properties, src => src);

            config.NewConfig<Point, Geometry>()
                .ConstructUsing(src => new Point(src.Coordinate));

            config.NewConfig<Polygon, Geometry>()
                .ConstructUsing(src => new Polygon(new LinearRing(src.Coordinates)));
        }
    }
}
