using Flagsmith.Core;

namespace Flagsmith.Example;

public class ExampleFeatureIdProvider : IFeatureIdProvider
{
    public IEnumerable<string> GetFeatureIds()
    {
        return Enum.GetNames(typeof(FeatureSetToUseInCode));

    }
}

public enum FeatureSetToUseInCode
{
    ActionManager,
    SyncCommands,
}