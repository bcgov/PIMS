using Mapster;
using Microsoft.Extensions.Options;
using System.Text.Json;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Mapping.Project
{
    public class DisposalProjectMetatdataMap : IRegister
    {
        #region Variables
        private readonly JsonSerializerOptions _serializerOptions;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectMap, initializes with specified arguments.
        /// </summary>
        /// <param name="serializerOptions"></param>
        public DisposalProjectMetatdataMap(IOptions<JsonSerializerOptions> serializerOptions)
        {
            _serializerOptions = serializerOptions.Value;
        }
        #endregion

        #region Methods
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<string, Entity.Models.DisposalProjectMetadata>()
                .BeforeMapping((src, dest) => JsonSerializer.Deserialize<Entity.Models.DisposalProjectMetadata>(src ?? "{}", _serializerOptions));

            config.NewConfig<Entity.Models.DisposalProjectMetadata, string>()
                .BeforeMapping((src, dest) => JsonSerializer.Serialize(src, _serializerOptions));
        }
        #endregion
    }
}
