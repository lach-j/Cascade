using Flagsmith.Core;

namespace Flagsmith.Example;

public class ExampleFeatureIdProvider : IFeatureIdProvider
{
    public IEnumerable<string> GetFeatureIds()
    {
        return typeof(Toggles)
            .GetFields()
            .Select(x => x.GetRawConstantValue().ToString());
    }
}

public class Toggles
{
    public const string AdvancedFilters = nameof(AdvancedFilters);

    public const string BulkExport = nameof(BulkExport);

    public const string CustomDashboards = nameof(CustomDashboards);

    public const string AutoSave = nameof(AutoSave);

    public const string RealTimeNotifications = nameof(RealTimeNotifications);

    public const string TeamCollaboration = nameof(TeamCollaboration);

    public const string AuditLog = nameof(AuditLog);

    public const string DataRetention = nameof(DataRetention);

    public const string CustomFields = nameof(CustomFields);

    public const string ApiAccess = nameof(ApiAccess);

    public const string TwoFactorAuth = nameof(TwoFactorAuth);

    public const string SearchSuggestions = nameof(SearchSuggestions);

    public const string ThemeCustomization = nameof(ThemeCustomization);

    public const string WorkflowAutomation = nameof(WorkflowAutomation);

    public const string AiSummarisation = nameof(AiSummarisation);
}