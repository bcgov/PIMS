using System;

namespace Pims.Core
{
    public interface ISimpleMapper
    {
        DT MapTo<DT, ST>(ST source, Action<ST, DT> action);
    }
}
