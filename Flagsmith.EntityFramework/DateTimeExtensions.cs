namespace Flagsmith.EntityFramework;

public static class DateTimeExtensions
{
    public static DateTime ToKindUtc(this DateTime value)
    {
        return KindUtc(value);
    }

    private static DateTime KindUtc(DateTime value)
    {
        if (value.Kind == DateTimeKind.Unspecified)
        {
            return DateTime.SpecifyKind(value, DateTimeKind.Utc);
        }
        else if (value.Kind == DateTimeKind.Local)
        {
            return value.ToUniversalTime();
        }
        return value;
    }
}